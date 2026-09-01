import React, { useState, useEffect } from 'react';
import API from '../../../services/api';
import { stockService } from '../../../services/stockService';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export default function CsvUploader({ zones, onUploadSuccess, onClose }) {
  const [file, setFile] = useState(null);
  const [selectedZone, setSelectedZone] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!zones || zones.length === 0) {
      setSelectedZone('');
      setSelectedPlan(null);
      setPlans([]);
      return;
    }

    const firstZoneId = zones[0]?._id || zones[0]?.id || '';
    setSelectedZone((current) => {
      if (current && zones.some((zone) => (zone._id || zone.id) === current)) {
        return current;
      }
      return firstZoneId;
    });
  }, [zones]);

  useEffect(() => {
    const loadPlans = async () => {
      if (!selectedZone) {
        setPlans([]);
        setSelectedPlan(null);
        return;
      }

      try {
        setPlansLoading(true);
        const response = await API.get(`/plans/zone/${selectedZone}`);
        const zonePlans = Array.isArray(response.data) ? response.data : [];
        setPlans(zonePlans);
        setSelectedPlan(zonePlans[0] || null);
      } catch (err) {
        console.error('Erreur chargement plans:', err);
        setPlans([]);
        setSelectedPlan(null);
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlans();
  }, [selectedZone]);

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

    if (!selectedZone) {
      setMessage({ type: 'error', text: 'Sélectionnez d’abord une zone avant d’importer un CSV.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let activePlan = selectedPlan;
      if (!activePlan && selectedZone) {
        const response = await API.get(`/plans/zone/${selectedZone}`);
        const zonePlans = Array.isArray(response.data) ? response.data : [];
        if (zonePlans.length === 0) {
          setMessage({ type: 'error', text: 'Aucun forfait disponible pour cette zone. Créez-en un avant d’importer.' });
          setLoading(false);
          return;
        }
        activePlan = zonePlans[0];
        setSelectedPlan(activePlan);
      }

      const planId = activePlan?._id || activePlan?.id;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('zone_id', selectedZone);
      if (planId) formData.append('plan_id', planId);

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

        {selectedZone && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Forfait associé</label>
            {plansLoading ? (
              <div className="text-[11px] text-slate-400">Chargement des forfaits…</div>
            ) : plans.length > 0 ? (
              <select
                value={selectedPlan?._id || selectedPlan?.id || ''}
                onChange={(e) => {
                  const plan = plans.find((p) => (p._id || p.id) === e.target.value);
                  setSelectedPlan(plan || null);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {plans.map((plan) => (
                  <option key={plan._id || plan.id} value={plan._id || plan.id}>
                    {plan.name} — {plan.price} FCFA
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-[11px] text-red-400">Aucun forfait trouvé pour cette zone.</div>
            )}
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
          disabled={loading || !file || plansLoading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {plansLoading ? 'Chargement du forfait…' : 'Lancer l\'importation'}
        </button>
      </form>
    </div>
  );
}