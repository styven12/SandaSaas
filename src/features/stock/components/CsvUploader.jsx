import React, { useState, useRef } from 'react';
import { stockService } from '../../../services/stockService';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Plus,
  Trash2,
} from 'lucide-react';

const EMPTY_ROW = {
  code: '',
  password: '',
  profile: 'default',
  duration: '',
};

/**
 * Parse une ligne CSV en respectant les champs entre guillemets.
 */
const parseCsvLine = (line = '', separator = ',') => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === separator && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());

  return values;
};

/**
 * Normalise les noms des colonnes CSV.
 */
const normalizeHeader = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, '')
    .replace(/[^a-z0-9]/g, '');

const normalizePlanName = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Parse le contenu CSV.
 */
const parseCsvRows = (csvText = '') => {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    return [];
  }

  const separator = rows[0].includes(';') && !rows[0].includes(',') ? ';' : ',';
  const headers = parseCsvLine(rows[0], separator).map(normalizeHeader);
  const parsed = [];

  for (let i = 1; i < rows.length; i += 1) {
    const values = parseCsvLine(rows[i], separator);

    if (!values.some((value) => String(value).trim())) {
      continue;
    }

    const item = {};

    headers.forEach((header, index) => {
      item[header] = values[index] ?? '';
    });

    const code =
      item.code ||
      item.name ||
      item.username ||
      item.user ||
      item.email ||
      '';

    const password =
      item.password ||
      item.pass ||
      item.pwd ||
      '';

    const profile =
      item.profile ||
      item.plan ||
      item.forfait ||
      'default';

    const duration =
      item.duration ||
      item.days ||
      item.validity ||
      '';

    if (code && password) {
      parsed.push({
        code: String(code).trim(),
        password: String(password).trim(),
        profile: String(profile).trim() || 'default',
        duration: String(duration).trim(),
      });
    }
  }

  return parsed;
};

/**
 * Transforme les lignes manuelles en CSV.
 */
const buildCsvFromRows = (items = []) => {
  const validItems = items.filter(
    (item) =>
      String(item.code || '').trim() &&
      String(item.password || '').trim()
  );

  const lines = [
    ['code', 'password', 'profile', 'duration'],
  ];

  validItems.forEach((item) => {
    lines.push([
      item.code || '',
      item.password || '',
      item.profile || 'default',
      item.duration || '',
    ]);
  });

  return lines
    .map((row) =>
      row
        .map(
          (cell) =>
            `"${String(cell ?? '').replace(/"/g, '""')}"`
        )
        .join(',')
    )
    .join('\n');
};

export default function CsvUploader({
  zones = [],
  onUploadSuccess,
  onClose,
}) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);

  const [rows, setRows] = useState([
    { ...EMPTY_ROW },
  ]);

  const [selectedZone, setSelectedZone] = useState(
    zones[0]?._id || zones[0]?.id || ''
  );

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  /**
   * Modifier une ligne.
   */
  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  /**
   * Ajouter une ligne.
   */
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { ...EMPTY_ROW },
    ]);
  };

  /**
   * Supprimer une ligne.
   */
  const removeRow = (index) => {
    if (rows.length === 1) {
      setRows([{ ...EMPTY_ROW }]);
      return;
    }

    setRows((prev) =>
      prev.filter(
        (_, rowIndex) => rowIndex !== index
      )
    );
  };

  /**
   * Importer un fichier CSV.
   */
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setMessage(null);

    const fileName =
      selectedFile.name.toLowerCase();

    if (!fileName.endsWith('.csv')) {
      setFile(null);
      setRows([{ ...EMPTY_ROW }]);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      setMessage({
        type: 'error',
        text:
          'Veuillez sélectionner un fichier CSV (.csv).',
      });

      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setRows([{ ...EMPTY_ROW }]);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      setMessage({
        type: 'error',
        text:
          'Le fichier CSV ne doit pas dépasser 5 Mo.',
      });

      return;
    }

    try {
      const csvText =
        await selectedFile.text();

      const parsedRows =
        parseCsvRows(csvText);

      if (parsedRows.length === 0) {
        setFile(null);
        setRows([{ ...EMPTY_ROW }]);

        setMessage({
          type: 'error',
          text:
            'Le fichier CSV est vide ou les colonnes code/password sont introuvables.',
        });

        return;
      }

      setFile(selectedFile);

      setRows(
        parsedRows.map((row) => ({
          ...row,
          profile:
            row.profile || 'default',
        }))
      );

      setMessage({
        type: 'success',
        text: `${parsedRows.length} ticket(s) détecté(s) dans le fichier CSV.`,
      });
    } catch (err) {
      console.error(
        'Erreur lecture CSV:',
        err
      );

      setFile(null);
      setRows([{ ...EMPTY_ROW }]);

      setMessage({
        type: 'error',
        text:
          'Impossible de lire le fichier CSV sélectionné.',
      });
    }
  };

  /**
   * Supprimer le fichier.
   */
  const handleRemoveFile = () => {
    setFile(null);
    setRows([{ ...EMPTY_ROW }]);

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setMessage(null);
  };

  /**
   * Tickets valides.
   */
  const normalizedRows = rows
    .map((row) => ({
      code: String(row.code || '').trim(),
      password: String(row.password || '').trim(),
      profile: String(row.profile || 'default').trim(),
      duration: String(row.duration || '').trim(),
    }))
    .filter(
      (row) =>
        row.code &&
        row.password
    );

  const hasValidTickets =
    normalizedRows.length > 0;

  /**
   * IMPORTATION
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      '🔥 BOUTON LANCER L’IMPORTATION CLIQUÉ'
    );

    setMessage(null);

    console.log(
      'Tickets valides:',
      normalizedRows
    );

    console.log(
      'Fichier:',
      file
    );

    console.log(
      'Zone:',
      selectedZone
    );

    /**
     * Vérification zone.
     */
    if (!selectedZone) {
      setMessage({
        type: 'error',
        text:
          'Veuillez sélectionner une zone.',
      });

      return;
    }

    /**
     * Vérification tickets.
     */
    if (!hasValidTickets && !file) {
      setMessage({
        type: 'error',
        text:
          'Ajoutez au moins un ticket avec code + password ou sélectionnez un fichier CSV.',
      });

      return;
    }

    try {
      setLoading(true);

      const plans = await stockService.getPlansByZone(selectedZone);
      const availablePlans = Array.isArray(plans)
        ? plans
        : plans?.plans || [];

      if (availablePlans.length === 0) {
        setMessage({
          type: 'error',
          text: 'Aucun forfait n’est configuré pour cette zone.',
        });
        return;
      }

      const plansByName = new Map(
        availablePlans.map((plan) => [normalizePlanName(plan.name), plan])
      );
      const hasSinglePlan = availablePlans.length === 1;
      const invalidProfile = normalizedRows.find((row) => {
        const profile = String(row.profile || '').trim();
        const profilePlan = plansByName.get(normalizePlanName(profile));
        const numericPlan = availablePlans.find(
          (plan) => String(plan.id) === profile
        );

        return !hasSinglePlan && !profilePlan && !numericPlan;
      });

      if (invalidProfile) {
        setMessage({
          type: 'error',
          text: `Le profil « ${invalidProfile.profile} » ne correspond à aucun forfait de cette zone.`,
        });
        return;
      }

      /**
       * Si des lignes sont saisies manuellement,
       * elles deviennent le CSV à envoyer.
       *
       * Sinon, on utilise directement le fichier.
       */
      let fileToUpload = file;

      if (!file && normalizedRows.length > 0) {
        const csvPayload =
          buildCsvFromRows(
            normalizedRows
          );

        console.log(
          '📄 CSV généré:',
          csvPayload
        );

        const blob = new Blob(
          [csvPayload],
          {
            type:
              'text/csv;charset=utf-8',
          }
        );

        fileToUpload = new File(
          [blob],
          file?.name ||
            'tickets.csv',
          {
            type:
              'text/csv;charset=utf-8',
          }
        );
      }

      /**
       * Vérification finale.
       */
      if (!fileToUpload) {
        setMessage({
          type: 'error',
          text:
            'Aucun fichier valide à importer.',
        });

        return;
      }

      /**
       * FormData.
       *
       * IMPORTANT :
       * Il n'y a plus de plan_id.
       */
      const formData =
        new FormData();

      formData.append(
        'file',
        fileToUpload
      );

      formData.append(
        'zone_id',
        selectedZone
      );

      console.log(
        '📤 Envoi FormData:',
        {
          file:
            fileToUpload.name,
          zone_id:
            selectedZone,
        }
      );

      /**
       * Appel backend.
       */
      const res =
        await stockService.uploadCsv(
          formData
        );

      console.log(
        '📥 Réponse serveur:',
        res
      );

      /**
       * Succès.
       */
      setMessage({
        type: 'success',
        text:
          res?.message ||
          `${res?.imported_count ??
            res?.insertedCount ??
            0} ticket(s) importé(s) avec succès !`,
      });

      /**
       * Reset.
       */
      setFile(null);

      setRows([
        { ...EMPTY_ROW },
      ]);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      /**
       * Callback parent.
       */
      if (
        typeof onUploadSuccess ===
        'function'
      ) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error(
        '❌ Erreur import CSV:',
        {
          error: err,
          message: err.message,
          response:
            err.response?.data,
          status:
            err.response?.status,
        }
      );

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'importation du fichier.";

      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-blue-400" />
          Importer des Tickets MikroTik
        </h3>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}

          <span>
            {message.text}
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* =========================
            ÉTAPE 1 : ZONE
        ========================== */}
        {zones.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">

            <div className="flex items-center gap-3">

              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                1
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">
                  Sélectionnez une Zone
                </label>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Choisissez la zone où importer les tickets
                </p>
              </div>

            </div>

            <select
              value={selectedZone}
              onChange={(e) =>
                setSelectedZone(
                  e.target.value
                )
              }
              disabled={loading}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >

              <option value="">
                -- Choisir une zone --
              </option>

              {zones.map((zone) => {
                const zoneId =
                  zone._id ||
                  zone.id;

                return (
                  <option
                    key={zoneId}
                    value={zoneId}
                  >
                    {zone.name}
                  </option>
                );
              })}

            </select>

            {selectedZone && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zone sélectionnée
              </div>
            )}

          </div>
        )}

        {/* =========================
            ÉTAPE 2 : TICKETS
        ========================== */}
        <div className="space-y-4">

          <div className="flex items-center gap-3">

            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              2
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Ajouter les Tickets
              </label>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Importez un CSV ou saisissez les tickets manuellement
              </p>
            </div>

          </div>

          {/* CSV */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

            <label
              htmlFor="csv-upload"
              className="border-2 border-dashed border-slate-700 hover:border-slate-600 bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition"
            >

              <FileText className="w-8 h-8 text-slate-500" />

              <span className="text-sm text-slate-300 font-medium text-center">
                {file
                  ? file.name
                  : 'Cliquez ou glissez votre fichier .CSV ici'}
              </span>

              <span className="text-[11px] text-slate-400 text-center">
                Format :
                code, password, profile, duration
              </span>

              {file && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="text-[11px] text-red-400 hover:text-red-300 font-medium mt-2"
                >
                  ✕ Supprimer le fichier
                </button>
              )}

              <input
                ref={inputRef}
                id="csv-upload"
                type="file"
                accept=".csv,text/csv"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />

            </label>

          </div>

          {/* MANUEL */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">

            <div className="flex items-center justify-between">

              <div>
                <label className="text-sm font-semibold text-slate-200">
                  Saisie manuelle
                </label>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ajoutez chaque ticket ligne par ligne
                </p>
              </div>

              <button
                type="button"
                onClick={addRow}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Ajouter une ligne
              </button>

            </div>

            {/* COMPTEUR */}
            <div className="text-[11px] text-slate-400 px-2">

              {normalizedRows.length > 0
                ? `${normalizedRows.length} ticket(s) valide(s)`
                : 'Aucun ticket valide'}

            </div>

            {/* LIGNES */}
            <div className="space-y-2">

              {rows.map(
                (row, index) => (
                  <div
                    key={`row-${index}`}
                    className="grid grid-cols-1 gap-2 rounded-xl border border-slate-700 bg-slate-800 p-3 md:grid-cols-5"
                  >

                    {/* CODE */}
                    <input
                      type="text"
                      placeholder="Code"
                      value={row.code}
                      onChange={(e) =>
                        updateRow(
                          index,
                          'code',
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />

                    {/* PASSWORD */}
                    <input
                      type="text"
                      placeholder="Password"
                      value={row.password}
                      onChange={(e) =>
                        updateRow(
                          index,
                          'password',
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />

                    {/* PROFILE */}
                    <input
                      type="text"
                      placeholder="Profile"
                      value={row.profile}
                      onChange={(e) =>
                        updateRow(
                          index,
                          'profile',
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />

                    {/* DURATION */}
                    <input
                      type="text"
                      placeholder="Duration"
                      value={row.duration}
                      onChange={(e) =>
                        updateRow(
                          index,
                          'duration',
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />

                    {/* SUPPRIMER */}
                    <button
                      type="button"
                      onClick={() =>
                        removeRow(index)
                      }
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-2 text-[11px] font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* =========================
            ÉTAPE 3 : IMPORTATION
        ========================== */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">

          <div className="flex items-center gap-3">

            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              3
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Vérifier et Importer
              </label>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Vérifiez les informations puis lancez l'importation
              </p>
            </div>

          </div>

          {/* RÉSUMÉ */}
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">

            <div className="text-[11px] text-slate-300 space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-slate-400">
                  Zone :
                </span>

                <span className="font-semibold text-slate-100">
                  {zones.find(
                    (zone) =>
                      (zone._id ||
                        zone.id) ===
                      selectedZone
                  )?.name ||
                    'Non sélectionnée'}
                </span>

              </div>

              <div className="flex items-center justify-between border-t border-slate-600 pt-2">

                <span className="text-slate-400">
                  Tickets valides :
                </span>

                <span className="font-semibold text-emerald-400">
                  {normalizedRows.length}
                </span>

              </div>

              {file && (
                <div className="flex items-center justify-between border-t border-slate-600 pt-2">

                  <span className="text-slate-400">
                    Fichier :
                  </span>

                  <span className="font-semibold text-slate-100 truncate max-w-[200px]">
                    {file.name}
                  </span>

                </div>
              )}

            </div>

          </div>

          {/* BOUTON IMPORTATION */}
          <button
            type="submit"
            disabled={
              loading ||
              !selectedZone ||
              (!hasValidTickets && !file)
            }
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/30"
          >

            {loading && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}

            {loading
              ? 'Importation en cours…'
              : "✓ Lancer l'importation"}

          </button>

        </div>

      </form>
    </div>
  );
}
