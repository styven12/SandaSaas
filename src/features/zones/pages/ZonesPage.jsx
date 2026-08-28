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
      setSelectedScript(res.script);
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
          <h1 className="text-xl font-bold text-white tracking-tight">Zones & Bornes WiFi</h1>
          <p className="text-xs text-slate-400">Gérez vos emplacements et générez leurs scripts de configuration MikroTik</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
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
            <div key={zone._id || zone.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleDelete(zone._id || zone.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-base">{zone.name}</h3>
                  <p className="text-xs font-mono text-slate-500">Slug: {zone.slug}</p>
                </div>
              </div>

              {/* URL Portail public */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 truncate">/portal/{zone.slug}</span>
                <a
                  href={`/portal/${zone.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
                >
                  Tester <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Bouton Script MikroTik */}
              <button
                onClick={() => handleShowScript(zone)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Terminal className="w-4 h-4 text-emerald-400" /> Générer Script MikroTik
              </button>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Radio className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">Aucune zone WiFi configurée</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
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