import React, { useState, useEffect } from 'react';
import { stockService } from '../../../services/stockService';
import { zoneService } from '../../../services/zoneService';
import CsvUploader from '../components/CsvUploader';
import StockTable from '../components/StockTable';
import { Ticket, Plus, Search, Loader2 } from 'lucide-react';

export default function StockPage() {
  const [tickets, setTickets] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, zonesRes] = await Promise.all([
        stockService.getTickets(),
        zoneService.getZones()
      ]);
      setTickets(ticketsRes.tickets || ticketsRes || []);
      setZones(zonesRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce ticket ?')) {
      try {
        await stockService.deleteTicket(id);
        fetchData();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const filteredTickets = tickets.filter((t) =>
    (t.code || t.username || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Stock de Tickets CSV</h1>
          <p className="text-xs text-slate-400">Importez et gérez les codes d'accès générés sur votre MikroTik</p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Importer CSV
        </button>
      </div>

      {/* Bloc Importation (Toggleable) */}
      {showUploader && (
        <CsvUploader
          zones={zones}
          onUploadSuccess={fetchData}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* Barre de Recherche */}
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-xl">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          placeholder="Rechercher un code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* Tableau des tickets */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <StockTable tickets={filteredTickets} onDelete={handleDelete} />
      )}

    </div>
  );
}