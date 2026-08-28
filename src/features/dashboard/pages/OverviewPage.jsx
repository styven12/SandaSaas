import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import KpiCards from '../components/KpiCards';
import RecentTransactions from '../components/RecentTransactions';
import { Loader2, RefreshCw } from 'lucide-react';

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      setError('Impossible de charger les statistiques du tableau de bord.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* En-tête de la Page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Vue d'ensemble</h1>
          <p className="text-xs text-slate-400">Aperçu en temps réel des performances de vos zones WiFi</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualiser
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* Cartes KPI */}
      <KpiCards stats={stats} />

      {/* Transactions Récents */}
      <RecentTransactions transactions={stats?.recentTransactions} />

    </div>
  );
}