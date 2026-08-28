import React, { useState, useEffect } from 'react';
import { logService } from "../../../services/logsService";
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  Loader2, 
  Calendar,
  Filter
} from 'lucide-react';

export default function LegalLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await logService.getLegalLogs({ search, startDate, endDate });
      setLogs(data.logs || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const blob = await logService.exportLogsCsv({ search, startDate, endDate });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registre_legal_wifi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Erreur lors de l'exportation du fichier CSV.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> Registre Légal des Connexions
          </h1>
          <p className="text-xs text-slate-400">
            Traçabilité des adresses MAC, IP et téléphones pour la conformité avec la réglementation ART
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={exporting || logs.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20 shrink-0"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Exporter Registre (CSV)
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-3">
        <form onSubmit={handleSearchSubmit} className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par Téléphone, MAC ou IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </form>

        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tableau des Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Données chiffrées et horodatées
          </span>
          <span className="text-xs text-slate-500">{logs.length} enregistrements trouvés</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Téléphone (OTP)</th>
                <th className="py-3 px-4">Adresse MAC</th>
                <th className="py-3 px-4">Adresse IP</th>
                <th className="py-3 px-4">Zone / Emplacement</th>
                <th className="py-3 px-4 text-right">Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center font-sans">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                    <span className="text-slate-500 text-xs">Chargement des données légales...</span>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-sans text-slate-400">
                      {new Date(log.createdAt || log.timestamp).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{log.phone || 'Non vérifié'}</td>
                    <td className="py-3 px-4 text-blue-400">{log.macAddress || log.mac || '00:00:00:00:00:00'}</td>
                    <td className="py-3 px-4 text-emerald-400">{log.ipAddress || log.ip || '192.168.88.X'}</td>
                    <td className="py-3 px-4 font-sans text-slate-300">{log.zoneName || log.zone?.name || 'Principale'}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-400">{log.ticketCode || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-sans">
                    Aucun enregistrement légal ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}