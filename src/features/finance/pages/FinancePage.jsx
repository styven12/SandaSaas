import React, { useState, useEffect } from 'react';
import { financeService } from '../../../services/financeService';
import BalanceCard from '../components/BalanceCard';
import PayoutsHistoryTable from '../components/PayoutsHistoryTable';
import { Loader2, RefreshCw } from 'lucide-react';

export default function FinancePage() {
  const [balanceData, setBalanceData] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balRes, payRes] = await Promise.all([
        financeService.getBalance(),
        financeService.getPayouts()
      ]);
      setBalanceData(balRes);
      setPayouts(payRes.payouts || payRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    </div>
  );
}