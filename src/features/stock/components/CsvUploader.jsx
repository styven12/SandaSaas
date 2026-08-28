import React, { useState } from 'react';
import { stockService } from '../../../services/stockService';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export default function CsvUploader({ zones, onUploadSuccess, onClose }) {
  const [file, setFile] = useState(null);
  const [selectedZone, setSelectedZone] = useState(zones[0]?._id || zones[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un fichier CSV.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    if (selectedZone) formData.append('zoneId', selectedZone);

    try {
      const res = await stockService.uploadCsv(formData);
      setMessage({
        type: 'success',
        text: res.message || `${res.insertedCount || 'Plusieurs'} tickets importés avec succès !`
      });
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Erreur lors de l\'importation du fichier.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-blue-400" /> Importer des Tickets MikroTik (CSV)
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {zones && zones.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Associer à la Zone</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {zones.map((z) => (
                <option key={z._id || z.id} value={z._id || z.id}>{z.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Zone de Drag & Drop */}
        <label className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
          <FileText className="w-8 h-8 text-slate-500" />
          <span className="text-xs text-slate-300 font-medium">
            {file ? file.name : 'Cliquez ou glissez votre fichier .CSV ici'}
          </span>
          <span className="text-[11px] text-slate-500">Format accepté : code, password, profile, duration</span>
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        </label>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Lancer l'importation
        </button>
      </form>
    </div>
  );
}