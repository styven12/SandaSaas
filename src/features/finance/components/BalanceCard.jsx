import React, { useState } from 'react';
import { financeService } from '../../../services/financeService';
import { Wallet, ArrowUpRight, Clock, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function BalanceCard({ balanceData, onPayoutRequested }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(balanceData?.payoutPhone || '');
  const [provider, setProvider] = useState('CM_OM'); // CM_OM ou CM_MOMO
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await financeService.requestPayout({
        amount: Number(amount),
        phone,
        provider
      });
      setSuccess('Demande de retrait transmise avec succès !');
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
        setAmount('');
        onPayoutRequested();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la demande de retrait.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solde Disponible */}
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-6 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">Solde Retirable</span>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {(balanceData?.available || 0).toLocaleString('fr-FR')} FCFA
            </div>
            <p className="text-[11px] text-slate-400">Transfert direct vers Orange / MTN Mobile Money</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30 shrink-0"
          >
            <ArrowUpRight className="w-4 h-4" /> Retirer
          </button>
        </div>

        {/* Solde en Attente / Bloqué */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">En cours de traitement</span>
            <div className="text-3xl font-bold text-slate-200 tracking-tight">
              {(balanceData?.pending || 0).toLocaleString('fr-FR')} FCFA
            </div>
            <p className="text-[11px] text-slate-500">Retraits ou paiements en cours de validation</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Modal de Demande de Retrait */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" /> Demander un Retrait Mobile Money
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Montant à retirer (FCFA)</label>
                <input
                  type="number"
                  required
                  min="500"
                  max={balanceData?.available || 0}
                  placeholder="Ex: 10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Opérateur</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="CM_OM">Orange Money (Cameroun)</option>
                  <option value="CM_MOMO">MTN Mobile Money (Cameroun)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Numéro de Réception</label>
                <input
                  type="tel"
                  required
                  placeholder="6XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Valider le Retrait
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}