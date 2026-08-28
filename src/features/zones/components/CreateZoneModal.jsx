import React, { useState } from 'react';
import { zoneService } from '../../../services/zoneService';
import { Radio, X, Loader2 } from 'lucide-react';

export default function CreateZoneModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    dnsName: 'wifi.sanda.net',
    currency: 'XAF'
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Radio className="w-4 h-4 text-blue-400" />
            <span>Ajouter une Nouvelle Zone WiFi</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
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
            <label className="block text-xs font-medium text-slate-400 mb-1">Nom de l'emplacement</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: Agency Douala Akwa"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Identifiant URL (Slug)</label>
            <input
              type="text"
              name="slug"
              required
              placeholder="douala-akwa"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nom DNS Hotspot (MikroTik)</label>
            <input
              type="text"
              name="dnsName"
              required
              placeholder="wifi.sanda.net"
              value={formData.dnsName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20"
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