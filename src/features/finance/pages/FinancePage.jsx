import React, { useState, useEffect } from 'react';
import { financeService } from '../../../services/financeService';
import BalanceCard from '../components/BalanceCard';
import PayoutsHistoryTable from '../components/PayoutsHistoryTable';
import { Loader2, RefreshCw, Download } from 'lucide-react';

export default function FinancePage() {
  const [balanceData, setBalanceData] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balRes, payRes, ledgerRes] = await Promise.all([
        financeService.getBalance(),
        financeService.getPayouts(),
        financeService.getLedger()
      ]);
      setBalanceData(balRes);
      setPayouts(payRes.payouts || payRes || []);
      setLedger(ledgerRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportLedger = () => {
    const header = 'Date,Type,Montant,Statut,Reference\n';
    const rows = ledger.map((entry) => [
      entry.created_at,
      entry.type,
      entry.amount,
      entry.status,
      entry.reference
    ].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historique-financier.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Comptabilité & Retraits</h1>
          <p className="text-xs text-slate-400">Gérez vos revenus et transférez vos fonds directement vers votre compte Mobile Money</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualiser
        </button>
      </div>

      <BalanceCard balanceData={balanceData} onPayoutRequested={fetchData} />
      <PayoutsHistoryTable payouts={payouts} />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 text-sm">Grand livre financier</h3>
          <button onClick={exportLedger} className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
            <Download className="w-3.5 h-3.5" /> Exporter CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="uppercase bg-slate-800/50 text-slate-400">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Référence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ledger.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-3 px-4">{new Date(entry.created_at).toLocaleString('fr-FR')}</td>
                  <td className="py-3 px-4">{entry.type}</td>
                  <td className={entry.amount < 0 ? 'py-3 px-4 text-red-400' : 'py-3 px-4 text-emerald-400'}>{entry.amount} FCFA</td>
                  <td className="py-3 px-4">{entry.status}</td>
                  <td className="py-3 px-4 font-mono">{entry.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}