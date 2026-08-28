import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function PayoutsHistoryTable({ payouts }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Validé
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Traitement...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" /> Rejeté
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-3 p-5">
      <h3 className="font-semibold text-slate-200 text-sm">Historique des Retraits Mobile Money</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Référence</th>
              <th className="py-3 px-4">Montant</th>
              <th className="py-3 px-4">Numéro</th>
              <th className="py-3 px-4">Opérateur</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {payouts && payouts.length > 0 ? (
              payouts.map((p) => (
                <tr key={p._id || p.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white">{p.reference || p._id?.substring(0, 8)}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{p.amount} FCFA</td>
                  <td className="py-3 px-4 text-slate-300">{p.phone}</td>
                  <td className="py-3 px-4 font-sans uppercase text-slate-400">{p.provider || 'Mobile Money'}</td>
                  <td className="py-3 px-4 font-sans">{getStatusBadge(p.status)}</td>
                  <td className="py-3 px-4 text-right font-sans text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500 font-sans">
                  Aucun historique de retrait trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}