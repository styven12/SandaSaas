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

const EMPTY_ROW = { code: '', password: '', profile: 'default', duration: '' };

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

  if (rows.length < 2) return [];

  const headers = parseCsvLine(rows[0]).map((header) => normalizeHeader(header));
  const parsed = [];

  for (let i = 1; i < rows.length; i += 1) {
    const values = parseCsvLine(rows[i]);

    if (!values.some((value) => String(value).trim())) continue;

    const item = {};
    headers.forEach((header, index) => {
      item[header] = values[index] ?? '';
    });

    const code = item.code || item.name || item.username || item.user || item.email || '';
    const password = item.password || item.pass || item.pwd || '';
    const profile = item.profile || item.plan || item.forfait || 'default';
    const duration = item.duration || item.days || item.validity || '';

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
    (item) => item.code || item.password || item.profile || item.duration
  );

  const lines = [['code', 'password', 'profile', 'duration']];

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
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
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
  const [rows, setRows] = useState([{ ...EMPTY_ROW }]);
  const [selectedZone, setSelectedZone] = useState(
    zones[0]?._id || zones[0]?.id || ''
  );

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);

  const [message, setMessage] = useState(null);

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

        const response = await API.get(`/plans/zone/${selectedZone}`);
        const zonePlans = Array.isArray(response.data) ? response.data : [];

        setPlans(zonePlans);
        setSelectedPlan(zonePlans[0] ?? null);
      } catch (err) {
        console.error('Erreur chargement plans:', err);
        setPlans([]);
        setSelectedPlan(null);
        setMessage({
          type: 'error',
          text:
            err.response?.data?.error ||
            'Impossible de charger les forfaits de cette zone.',
        });
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlans();
  }, [selectedZone]);

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) {
      setRows([{ ...EMPTY_ROW }]);
      return;
    }

    setRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setMessage(null);

    const fileName = selectedFile.name.toLowerCase();

    if (!fileName.endsWith('.csv')) {
      setFile(null);
      setRows([{ ...EMPTY_ROW }]);
      if (inputRef.current) inputRef.current.value = '';
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner un fichier CSV (.csv).',
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setRows([{ ...EMPTY_ROW }]);
      if (inputRef.current) inputRef.current.value = '';
      setMessage({
        type: 'error',
        text: 'Le fichier CSV ne doit pas dépasser 5 Mo.',
      });
      return;
    }

    try {
      const csvText = await selectedFile.text();
      const parsedRows = parseCsvRows(csvText);

      setFile(selectedFile);

      if (parsedRows.length > 0) {
        setRows(parsedRows.map((row) => ({ ...row, profile: row.profile || 'default' })));
      } else {
        setRows([{ ...EMPTY_ROW }]);
        setMessage({
          type: 'error',
          text: 'Le fichier CSV est vide ou les colonnes attendues sont introuvables.',
        });
      }
    } catch (err) {
      console.error('Erreur lecture CSV:', err);
      setFile(null);
      setRows([{ ...EMPTY_ROW }]);
      setMessage({
        type: 'error',
        text: 'Impossible de lire le fichier CSV sélectionné.',
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setRows([{ ...EMPTY_ROW }]);
    if (inputRef.current) inputRef.current.value = '';
    setMessage(null);
  };

  const hasManualEntries = rows.some(
    (row) => row.code || row.password || row.profile || row.duration
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const normalizedRows = rows.filter(
      (row) => row.code || row.password || row.profile || row.duration
    );

    if (normalizedRows.length === 0 && !file) {
      setMessage({
        type: 'error',
        text: 'Ajoutez au moins un élément ou sélectionnez un fichier CSV.',
      });
      return;
    }

    if (!selectedZone) {
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner une zone.',
      });
      return;
    }

    if (!selectedPlan) {
      setMessage({
        type: 'error',
        text:
          'Aucun forfait disponible pour cette zone. Créez d’abord un forfait avant d’importer des tickets.',
      });
      return;
    }

    const planId = selectedPlan?._id || selectedPlan?.id;

    if (!planId) {
      setMessage({
        type: 'error',
        text: 'Impossible de récupérer l’identifiant du forfait.',
      });
      return;
    }

    try {
      setLoading(true);

      const fileToUpload = (() => {
        if (normalizedRows.length > 0) {
          const csvPayload = buildCsvFromRows(normalizedRows);
          return new File([csvPayload], file?.name || 'tickets.csv', {
            type: 'text/csv;charset=utf-8',
          });
        }
        return file;
      })();

      if (!fileToUpload) {
        setMessage({
          type: 'error',
          text: 'Aucun fichier ou éléments valides à importer.',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('zone_id', selectedZone);
      formData.append('plan_id', planId);

      const res = await stockService.uploadCsv(formData);

      setMessage({
        type: 'success',
        text:
          res?.message ||
          `${res?.imported_count ?? res?.insertedCount ?? 0} tickets importés avec succès !`,
      });

      setFile(null);
      setRows([{ ...EMPTY_ROW }]);
      if (inputRef.current) inputRef.current.value = '';

      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('Erreur import CSV:', err);

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

          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {zones.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Associer à la Zone
            </label>

            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setSelectedPlan(null);
              }}
              disabled={loading}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              {zones.map((zone) => {
                const zoneId = zone._id || zone.id;

                return (
                  <option key={zoneId} value={zoneId}>
                    {zone.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedZone && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Forfait associé
            </label>

            {plansLoading ? (
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Chargement des forfaits…
              </div>
            ) : plans.length > 0 ? (
              <select
                value={selectedPlan?._id || selectedPlan?.id || ''}
                onChange={(e) => {
                  const plan = plans.find((p) => (p._id || p.id) === e.target.value);
                  setSelectedPlan(plan || null);
                }}
                disabled={loading}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                {plans.map((plan) => {
                  const planId = plan._id || plan.id;

                  return (
                    <option key={planId} value={planId}>
                      {plan.name} — {plan.price} FCFA
                    </option>
                  );
                })}
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400">
                Aucun forfait trouvé pour cette zone.
              </div>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="csv-upload"
            className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition"
          >
            <FileText className="w-8 h-8 text-slate-500" />

            <span className="text-xs text-slate-300 font-medium text-center">
              {file ? file.name : 'Cliquez ou glissez votre fichier .CSV ici'}
            </span>

            <span className="text-[11px] text-slate-500 text-center">
              Format accepté : code, password, profile, duration
            </span>

            {file && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-[11px] text-red-400 hover:text-red-300"
              >
                Supprimer le fichier
              </button>
            )}

            <input
              ref={inputRef}
              id="csv-upload"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-400">
              Éléments manuels
            </label>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-medium text-white hover:bg-blue-500"
            >
              <Plus className="w-3 h-3" />
              Ajouter
            </button>
          </div>

          {rows.map((row, index) => (
            <div
              key={`row-${index}`}
              className="grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2 md:grid-cols-5"
            >
              <input
                type="text"
                placeholder="code"
                value={row.code}
                onChange={(e) => updateRow(index, 'code', e.target.value)}
                className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="password"
                value={row.password}
                onChange={(e) => updateRow(index, 'password', e.target.value)}
                className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="profile"
                value={row.profile}
                onChange={(e) => updateRow(index, 'profile', e.target.value)}
                className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="duration"
                value={row.duration}
                onChange={(e) => updateRow(index, 'duration', e.target.value)}
                className="px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-2 text-[10px] font-medium text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="w-3 h-3" />
                Supprimer
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            (!file && !hasManualEntries) ||
            !selectedPlan ||
            !selectedZone ||
            plansLoading
          }
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading
            ? 'Importation en cours…'
            : plansLoading
            ? 'Chargement du forfait…'
            : "Lancer l'importation"}
        </button>
      </form>
    </div>
  );
}
