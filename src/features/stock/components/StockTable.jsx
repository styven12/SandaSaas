import React from 'react';
import { CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react';

export default function StockTable({ tickets, onDelete }) {
  const getStatusBadge = (status) => {
    if (status === 'AVAILABLE' || status === 'UNUSED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Disponible
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
        <ShoppingBag className="w-3 h-3" /> Vendu
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Code / Username</th>
              <th className="py-3 px-4">Mot de Passe</th>
              <th className="py-3 px-4">Profil / Durée</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id || ticket.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white">{ticket.code || ticket.username}</td>
                  <td className="py-3 px-4 text-slate-400">{ticket.password || '-'}</td>
                  <td className="py-3 px-4 text-blue-400">{ticket.profile || ticket.duration || 'Standard'}</td>
                  <td className="py-3 px-4 font-sans">{getStatusBadge(ticket.status)}</td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => onDelete(ticket._id || ticket.id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500 font-sans">
                  Aucun ticket trouvé dans le stock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}