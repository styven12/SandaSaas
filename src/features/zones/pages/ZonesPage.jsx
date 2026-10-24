import React, { useState, useEffect } from 'react';
import { zoneService } from '../../../services/zoneService';
import CreateZoneModal from '../components/CreateZoneModal';
import MikrotikScriptModal from '../components/MikrotikScriptModal';
import { Radio, Plus, Terminal, Trash2, ExternalLink, Loader2 } from 'lucide-react';

export default function ZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [activeZone, setActiveZone] = useState(null);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const data = await zoneService.getZones();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleShowScript = async (zone) => {
    try {
      const res = await zoneService.getMikrotikScript(zone._id || zone.id);
      setActiveZone(zone);
      setSelectedScript(typeof res === 'string' ? res : res.script);
    } catch (err) {
      alert("Erreur lors de la récupération du script.");
    }
  };

  const handleDelete = async (zoneId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette zone ?")) {
      try {
        await zoneService.deleteZone(zoneId);
        fetchZones();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Zones WiFi</h1>
          <p className="mt-1 text-sm text-slate-600">Gérez vos emplacements et préparez la configuration de vos routeurs MikroTik.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          <Plus className="w-4 h-4" /> Nouvelle Zone
        </button>
      </div>

      {/* Grille des zones */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : zones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
          <div key={zone._id || zone.id} className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-2 text-indigo-700">
                    <Radio className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleDelete(zone._id || zone.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{zone.name}</h3>
                  <p className="font-mono text-xs text-slate-500">/{zone.slug}</p>
                </div>
              </div>

              {/* URL Portail public */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs">
                <span className="truncate text-slate-600">/portal/{zone.slug}</span>
                <a
                  href={`/portal/${zone.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  Tester <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Bouton Script MikroTik */}
              <button
                onClick={() => handleShowScript(zone)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800"
              >
                <Terminal className="h-4 w-4 text-indigo-600" /> Générer le script MikroTik
              </button>

            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Radio className="mx-auto h-10 w-10 text-slate-400" />
          <div className="text-sm font-semibold text-slate-800">Aucune zone WiFi configurée</div>
          <p className="mx-auto max-w-sm text-sm text-slate-500">
            Créez votre première zone pour générer automatiquement le script de configuration pour votre routeur MikroTik.
          </p>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateZoneModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchZones}
        />
      )}

      {selectedScript && (
        <MikrotikScriptModal
          zone={activeZone}
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
        />
      )}

    </div>
  );
}
