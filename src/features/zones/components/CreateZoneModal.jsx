import React, { useState } from 'react';
import { zoneService } from '../../../services/zoneService';
import { Radio, X, Loader2 } from 'lucide-react';

export default function CreateZoneModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      // Auto-génération d'un slug propre
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      setFormData({ ...formData, name: value, slug: generatedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await zoneService.createZone(formData);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création de la zone.');
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Radio className="h-4 w-4 text-indigo-600" />
            <span>Ajouter une Nouvelle Zone WiFi</span>
          </div>
          <button aria-label="Fermer" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Nom de l'emplacement</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: Agency Douala Akwa"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Identifiant URL (Slug)</label>
            <input
              type="text"
              name="slug"
              required
              placeholder="douala-akwa"
              value={formData.slug}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-700 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-700"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Créer la zone
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
