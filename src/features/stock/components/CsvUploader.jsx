import React, { useState, useEffect, useRef } from 'react';
import API from '../../../services/api';
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

const parseCsvLine = (line = '') => {
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

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());

  return values;
};

const normalizeHeader = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, '')
    .replace(/[^a-z0-9]/g, '');

const parseCsvRows = (csvText = '') => {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    return [];
  }

  const headers = parseCsvLine(rows[0]).map(normalizeHeader);

  const parsed = [];

  for (let i = 1; i < rows.length; i += 1) {
    const values = parseCsvLine(rows[i]);

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

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);

  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [creatingPlan, setCreatingPlan] = useState(false);

  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!selectedZone && zones.length > 0) {
      setSelectedZone(zones[0]?._id || zones[0]?.id || '');
    }
  }, [selectedZone, zones]);

  /*
   * Chargement des forfaits
   */
  useEffect(() => {
    const loadPlans = async () => {
      if (!selectedZone) {
        setPlans([]);
        setSelectedPlan(null);
        return;
      }

      try {
        setPlansLoading(true);
        setMessage(null);

        const response = await API.get(
          `/plans/zone/${selectedZone}`
        );

        const zonePlans = Array.isArray(response.data)
          ? response.data
          : [];

        setPlans(zonePlans);

        setSelectedPlan(zonePlans[0] || null);
      } catch (err) {
        console.error(
          'Erreur chargement plans:',
          err
        );

        setPlans([]);
        setSelectedPlan(null);

        setMessage({
          type: 'error',
          text:
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Impossible de charger les forfaits de cette zone.',
        });
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlans();
  }, [selectedZone]);

  /*
   * Créer un forfait
   */
  const handleCreatePlan = async (e) => {
    e.preventDefault();

    const price = Number(newPlanPrice);

    if (!newPlanName.trim() || !Number.isFinite(price) || price <= 0) {
      setMessage({
        type: 'error',
        text: 'Veuillez renseigner un nom et un prix supérieur à zéro.',
      });
      return;
    }

    setCreatingPlan(true);

    try {
      const zoneId = selectedZone;

      const response =
        await stockService.createPlan(
          zoneId,
          newPlanName.trim(),
          price
        );

      setNewPlanName('');
      setNewPlanPrice('');

      setMessage({
        type: 'success',
        text: `Forfait "${response.plan?.name || newPlanName.trim()}" créé avec succès !`,
      });

      // Recharger les forfaits
      setPlansLoading(true);
      const updatedPlansResponse =
        await stockService.getPlansByZone(zoneId);
      const updatedPlans = Array.isArray(updatedPlansResponse)
        ? updatedPlansResponse
        : updatedPlansResponse?.plans || [];
      setPlans(updatedPlans);

      if (updatedPlans.length > 0) {
        setSelectedPlan(
          updatedPlans[0]
        );
      }
    } catch (err) {
      console.error(
        'Erreur création forfait:',
        err
      );

      setMessage({
        type: 'error',
        text:
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Erreur lors de la création du forfait.',
      });
    } finally {
      setCreatingPlan(false);
      setPlansLoading(false);
    }
  };

  /*
   * Modification d'une ligne
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

  /*
   * Ajouter une ligne
   */
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { ...EMPTY_ROW },
    ]);
  };

  /*
   * Supprimer une ligne
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

  /*
   * Sélection du fichier CSV
   */
  const handleFileChange = async (e) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setMessage(null);

    const fileName =
      selectedFile.name.toLowerCase();

    if (!fileName.endsWith('.csv')) {
      setFile(null);

      setRows([
        { ...EMPTY_ROW },
      ]);

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

      setRows([
        { ...EMPTY_ROW },
      ]);

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

        setRows([
          { ...EMPTY_ROW },
        ]);

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

      setRows([
        { ...EMPTY_ROW },
      ]);

      setMessage({
        type: 'error',
        text:
          'Impossible de lire le fichier CSV sélectionné.',
      });
    }
  };

  /*
   * Supprimer le fichier
   */
  const handleRemoveFile = () => {
    setFile(null);

    setRows([
      { ...EMPTY_ROW },
    ]);

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setMessage(null);
  };

  /*
   * Vérifie les entrées manuelles
   */
  const hasManualEntries = rows.some(
    (row) =>
      String(row.code || '').trim() &&
      String(row.password || '').trim()
  );

  /*
   * IMPORTATION
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      '🔥 BOUTON LANCER L’IMPORTATION CLIQUÉ'
    );

    setMessage(null);

    /*
     * Récupérer uniquement les lignes valides
     */
    const normalizedRows = rows
      .map((row) => ({
        code: String(
          row.code || ''
        ).trim(),

        password: String(
          row.password || ''
        ).trim(),

        profile: String(
          row.profile || 'default'
        ).trim(),

        duration: String(
          row.duration || ''
        ).trim(),
      }))
      .filter(
        (row) =>
          row.code &&
          row.password
      );

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

    console.log(
      'Forfait:',
      selectedPlan
    );

    /*
     * Vérification des tickets
     */
    if (
      normalizedRows.length === 0 &&
      !file
    ) {
      setMessage({
        type: 'error',
        text:
          'Ajoutez au moins un ticket avec code + password ou sélectionnez un fichier CSV.',
      });

      return;
    }

    /*
     * Vérification zone
     */
    if (!selectedZone) {
      setMessage({
        type: 'error',
        text:
          'Veuillez sélectionner une zone.',
      });

      return;
    }

    /*
     * Vérification forfait
     */
    if (!selectedPlan) {
      setMessage({
        type: 'error',
        text:
          'Aucun forfait disponible pour cette zone. Créez d’abord un forfait.',
      });

      return;
    }

    const planId =
      selectedPlan._id ||
      selectedPlan.id;

    if (!planId) {
      setMessage({
        type: 'error',
        text:
          'Impossible de récupérer l’identifiant du forfait.',
      });

      return;
    }

    try {
      setLoading(true);

      /*
       * Construire le fichier à envoyer
       *
       * Si des tickets sont présents dans
       * les lignes du formulaire, on crée
       * un nouveau CSV.
       */
      let fileToUpload = file;

      if (normalizedRows.length > 0) {
        const csvPayload =
          buildCsvFromRows(
            normalizedRows
          );

        console.log(
          'CSV envoyé:',
          csvPayload
        );

        const blob = new Blob(
          [csvPayload],
          {
            type: 'text/csv;charset=utf-8',
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

      /*
       * Vérification finale
       */
      if (!fileToUpload) {
        setMessage({
          type: 'error',
          text:
            'Aucun fichier valide à importer.',
        });

        return;
      }

      /*
       * FormData
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

      formData.append(
        'plan_id',
        planId
      );

      console.log(
        '📤 Envoi FormData:',
        {
          file:
            fileToUpload.name,
          zone_id:
            selectedZone,
          plan_id:
            planId,
        }
      );

      /*
       * Appel backend
       */
      const res =
        await stockService.uploadCsv(
          formData
        );

      console.log(
        '📥 Réponse serveur:',
        res
      );

      /*
       * Message succès
       */
      setMessage({
        type: 'success',
        text:
          res?.message ||
          `${res?.imported_count ??
            res?.insertedCount ??
            0} ticket(s) importé(s) avec succès !`,
      });

      /*
       * Reset
       */
      setFile(null);

      setRows([
        { ...EMPTY_ROW },
      ]);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      /*
       * Callback parent
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-blue-400" />
          Importer des Tickets MikroTik (CSV)
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

        {/* ÉTAPE 1 : SÉLECTION ZONE */}
        {zones.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white flex-shrink-0">
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
              onChange={(e) => {
                setSelectedZone(
                  e.target.value
                );

                setSelectedPlan(
                  null
                );
              }}
              disabled={loading}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
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
                Zone sélectionnée avec succès
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 2 : SÉLECTION FORFAIT */}
        {selectedZone && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white flex-shrink-0">
                2
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200">
                  Sélectionnez le Forfait
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Choisissez le forfait pour ces tickets
                </p>
              </div>
            </div>

            {plansLoading ? (
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Chargement des forfaits…
              </div>
            ) : plans.length > 0 ? (
              <>
                <select
                  value={
                    selectedPlan?._id ||
                    selectedPlan?.id ||
                    ''
                  }
                  onChange={(e) => {
                    const plan =
                      plans.find(
                        (p) =>
                          (p._id ||
                            p.id) ===
                          e.target.value
                      );

                    setSelectedPlan(
                      plan || null
                    );
                  }}
                  disabled={loading}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
                >
                  <option value="">
                    -- Choisir un
                    forfait --
                  </option>

                  {plans.map(
                    (plan) => {
                      const planId =
                        plan._id ||
                        plan.id;

                      return (
                        <option
                          key={planId}
                          value={planId}
                        >
                          {plan.name} —{' '}
                          {plan.price}{' '}
                          FCFA
                        </option>
                      );
                    }
                  )}
                </select>

                {selectedPlan && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Forfait
                    sélectionné
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Aucun forfait trouvé pour cette zone. Créez-en un maintenant.</span>
                </div>

                <div
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                      Nom du forfait
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Basic, Premium, Pro"
                      value={
                        newPlanName
                      }
                      onChange={(e) =>
                        setNewPlanName(
                          e.target
                            .value
                        )
                      }
                      disabled={
                        creatingPlan
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                      Prix (FCFA)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 5000"
                      value={
                        newPlanPrice
                      }
                      onChange={(e) =>
                        setNewPlanPrice(
                          e.target
                            .value
                        )
                      }
                      disabled={
                        creatingPlan
                      }
                      min="1"
                      step="100"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCreatePlan}
                    disabled={
                      creatingPlan ||
                      !newPlanName.trim() ||
                      !newPlanPrice.trim() ||
                      Number(newPlanPrice) <= 0
                    }
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    {creatingPlan && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    {creatingPlan
                      ? 'Création en cours…'
                      : '+ Créer le forfait'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 3 : IMPORTER CSV OU AJOUTER MANUELLEMENT */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white flex-shrink-0">
              3
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Importer les Tickets
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Choisissez un fichier CSV ou ajoutez les tickets manuellement
              </p>
            </div>
          </div>

          {/* CSV Upload */}
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
                Format accepté :
                code, password,
                profile, duration
              </span>

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

            {file && (
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={loading}
                className="mt-2 text-[11px] text-red-400 hover:text-red-300 font-medium disabled:opacity-50"
              >
                ✕ Supprimer le fichier
              </button>
            )}
          </div>

          {/* ENTRÉES MANUELLES */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-slate-200">
                  Ou ajoutez manuellement
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ajouter des tickets ligne par ligne
                </p>
              </div>

              <button
                type="button"
                onClick={addRow}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
              >
                <Plus className="w-4 h-4" />
                Ajouter une ligne
              </button>
            </div>

            {rows.length > 0 && (
              <div className="text-[11px] text-slate-400 px-2">
                {rows.filter(
                  (row) =>
                    String(
                      row.code
                    ).trim() &&
                    String(
                      row.password
                    ).trim()
                ).length > 0
                  ? `${rows.filter(
                      (row) =>
                        String(
                          row.code
                        ).trim() &&
                        String(
                          row.password
                        ).trim()
                    ).length} ticket(s) valide(s)`
                  : 'Aucun ticket valide (code + password requis)'}
              </div>
            )}

            <div className="space-y-2">
              {rows.map(
                (row, index) => (
                  <div
                    key={`row-${index}`}
                    className="grid grid-cols-1 gap-2 rounded-xl border border-slate-700 bg-slate-800 p-3 md:grid-cols-5"
                  >
                <input
                  type="text"
                  placeholder="code"
                  value={row.code}
                  onChange={(e) =>
                    updateRow(
                      index,
                      'code',
                      e.target.value
                    )
                  }
                  disabled={loading}
                  className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />

                <input
                  type="text"
                  placeholder="password"
                  value={
                    row.password
                  }
                  onChange={(e) =>
                    updateRow(
                      index,
                      'password',
                      e.target.value
                    )
                  }
                  disabled={loading}
                  className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />

                <input
                  type="text"
                  placeholder="profile"
                  value={
                    row.profile
                  }
                  onChange={(e) =>
                    updateRow(
                      index,
                      'profile',
                      e.target.value
                    )
                  }
                  disabled={loading}
                  className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />

                <input
                  type="text"
                  placeholder="duration"
                  value={
                    row.duration
                  }
                  onChange={(e) =>
                    updateRow(
                      index,
                      'duration',
                      e.target.value
                    )
                  }
                  disabled={loading}
                  className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeRow(index)
                  }
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-2 text-[11px] font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-50 transition"
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

        {/* ÉTAPE 4 : RÉSUMÉ ET IMPORTATION */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white flex-shrink-0">
              4
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Vérifier et Importer
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Vérifiez vos données puis lancez l'importation
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Zone :
                </span>
                <span className="font-semibold text-slate-100">
                  {zones.find((zone) =>
                    String(zone._id || zone.id) === String(selectedZone)
                  )?.name ||
                    'Non sélectionnée'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Forfait :
                </span>
                <span className="font-semibold text-slate-100">
                  {selectedPlan?.name ||
                    'Non sélectionné'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-600 pt-1 mt-1">
                <span className="text-slate-400">
                  Tickets valides :
                </span>
                <span className="font-semibold text-emerald-400">
                  {rows.filter(
                    (row) =>
                      String(
                        row.code
                      ).trim() &&
                      String(
                        row.password
                      ).trim()
                  ).length}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              plansLoading ||
              !selectedZone ||
              !selectedPlan ||
              rows.filter(
                (row) =>
                  String(
                    row.code
                  ).trim() &&
                  String(
                    row.password
                  ).trim()
              ).length === 0
            }
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/30"
          >
            {loading && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}

            {loading
              ? 'Importation en cours…'
              : plansLoading
              ? 'Chargement du forfait…'
              : "✓ Lancer l'importation"}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-[11px] font-medium ${
              message.type ===
              'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/20 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

