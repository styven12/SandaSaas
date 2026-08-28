import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Réussi
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" /> Échoué
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-200 text-sm">Dernières Ventes & Payements</h3>
        <span className="text-xs text-slate-500">Mise à jour automatique</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Forfait</th>
              <th className="py-3 px-4">Montant</th>
              <th className="py-3 px-4">Méthode</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {transactions && transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id || tx.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-medium text-white">{tx.phone || 'Inconnu'}</td>
                  <td className="py-3 px-4 text-slate-400">{tx.planName || 'Forfait WiFi'}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400">{tx.amount} FCFA</td>
                  <td className="py-3 px-4 uppercase text-xs font-mono text-slate-400">{tx.provider || 'Mobile Money'}</td>
                  <td className="py-3 px-4">{getStatusBadge(tx.status)}</td>
                  <td className="py-3 px-4 text-right text-xs text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                  Aucune transaction récente enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}