import React, { useEffect, useState } from 'react';
import { Edit3, Loader2, Package, Plus, Trash2, X } from 'lucide-react';
import { zoneService } from '../../../services/zoneService';
import { stockService } from '../../../services/stockService';

const emptyForm = { name: '', price: '' };

export default function PlansPage() {
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(null);

  const loadZones = async () => {
    try {
      const data = await zoneService.getZones();
      setZones(data || []);
      if (data?.length > 0) {
        setSelectedZoneId(String(data[0].id || data[0]._id));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Impossible de charger les zones.' });
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    if (!selectedZoneId) {
      setPlans([]);
      return;
    }

    setPlansLoading(true);
    try {
      const data = await stockService.getPlansByZone(selectedZoneId);
      setPlans(Array.isArray(data) ? data : data?.plans || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Impossible de charger les forfaits.' });
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  useEffect(() => {
    loadPlans();
  }, [selectedZoneId]);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({ name: plan.name || '', price: String(plan.price || '') });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingPlan(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const price = Number(form.price);

    if (!form.name.trim() || !Number.isFinite(price) || price <= 0) {
      setMessage({ type: 'error', text: 'Saisissez un nom et un prix supérieur à zéro.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      if (editingPlan) {
        await stockService.updatePlan(editingPlan.id || editingPlan._id, {
          wifi_zone_id: selectedZoneId,
          name: form.name.trim(),
          price,
        });
        setMessage({ type: 'success', text: 'Forfait modifié avec succès.' });
      } else {
        await stockService.createPlan(selectedZoneId, form.name.trim(), price);
        setMessage({ type: 'success', text: 'Forfait ajouté avec succès.' });
      }
      closeForm();
      await loadPlans();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Impossible d’enregistrer le forfait.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Supprimer le forfait « ${plan.name} » ?`)) return;

    try {
      await stockService.deletePlan(plan.id || plan._id);
      setMessage({ type: 'success', text: 'Forfait supprimé avec succès.' });
      await loadPlans();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Impossible de supprimer le forfait.' });
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Forfaits par zone</h1>
          <p className="text-xs text-slate-400">Gérez les offres disponibles dans chaque zone WiFi.</p>
        </div>
        <button onClick={openCreate} disabled={!selectedZoneId} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition">
          <Plus className="w-4 h-4" /> Ajouter un forfait
        </button>
      </div>

      {message && <div className={`${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} border p-3 rounded-xl text-xs`}>{message.text}</div>}

      {zones.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-sm text-slate-400">Créez d’abord une zone WiFi pour ajouter des forfaits.</div>
      ) : (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <label className="block text-xs font-medium text-slate-400 mb-2">Zone WiFi</label>
            <select value={selectedZoneId} onChange={(event) => setSelectedZoneId(event.target.value)} className="w-full sm:max-w-md px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500">
              {zones.map((zone) => <option key={zone.id || zone._id} value={zone.id || zone._id}>{zone.name}</option>)}
            </select>
          </div>

          {plansLoading ? <div className="h-40 flex items-center justify-center"><Loader2 className="w-7 h-7 text-blue-500 animate-spin" /></div> : plans.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-2"><Package className="w-10 h-10 text-slate-600 mx-auto" /><p className="text-sm text-slate-300">Aucun forfait dans cette zone</p><p className="text-xs text-slate-500">Ajoutez une offre pour la rendre disponible sur le portail.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {plans.map((plan) => <div key={plan.id || plan._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-white">{plan.name}</h2><p className="text-2xl font-extrabold text-blue-400 mt-2">{plan.price} <span className="text-xs font-medium text-slate-500">XAF</span></p></div><Package className="w-5 h-5 text-blue-400" /></div><div className="flex items-center justify-between text-xs text-slate-500"><span>{plan.stock_tickets || 0} ticket(s) disponible(s)</span><span>Zone sélectionnée</span></div><div className="flex gap-2"><button onClick={() => openEdit(plan)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"><Edit3 className="w-3.5 h-3.5" /> Modifier</button><button onClick={() => handleDelete(plan)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl" aria-label={`Supprimer ${plan.name}`}><Trash2 className="w-4 h-4" /></button></div></div>)}
            </div>
          )}
        </>
      )}

      {formOpen && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4"><div className="flex items-center justify-between border-b border-slate-800 pb-3"><h2 className="text-sm font-semibold text-white">{editingPlan ? 'Modifier le forfait' : 'Ajouter un forfait'}</h2><button onClick={closeForm} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-xs font-medium text-slate-400 mb-1">Nom du forfait</label><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex : Pass 1 heure" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" /></div><div><label className="block text-xs font-medium text-slate-400 mb-1">Prix (XAF)</label><input required min="1" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="500" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" /></div><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={closeForm} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl">Annuler</button><button disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{editingPlan ? 'Enregistrer' : 'Ajouter'}</button></div></form></div></div>}
    </div>
  );
}
