import React, { useState, useEffect } from 'react';
import { smsService } from '../../../services/smsService';
import { 
  MessageSquare, 
  Zap, 
  CheckCircle2, 
  Smartphone, 
  Loader2, 
  ShieldCheck,
  AlertCircle 
} from 'lucide-react';

export default function SmsStorePage() {
  const [balance, setBalance] = useState(0);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État d'achat
  const [selectedPack, setSelectedPack] = useState(null);
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('CM_OM');
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await smsService.getSmsStoreInfo();
      setBalance(data.balance || 0);
      setPacks(data.packs || [
        { id: 'sms_100', smsCount: 100, price: 1500, label: 'Débutant' },
        { id: 'sms_500', smsCount: 500, price: 6000, label: 'Populaire', popular: true },
        { id: 'sms_2000', smsCount: 2000, price: 20000, label: 'Pro / Business' },
      ]);
      if (data.packs && data.packs.length > 0) {
        setSelectedPack(data.packs[1] || data.packs[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!selectedPack || !phone) return;

    setPurchasing(true);
    setMessage(null);

    try {
      await smsService.buySmsPack({
        packId: selectedPack.id || selectedPack._id,
        phone,
        provider
      });
      setMessage({ type: 'success', text: 'Paiement initié ! Validez la transaction sur votre téléphone.' });
      setTimeout(fetchData, 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur lors de l\'achat du pack SMS.' });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" /> Boutique SMS OTP
          </h1>
          <p className="text-xs text-slate-400">Rechargez votre solde pour envoyer les codes de vérification SMS à vos clients</p>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-3 rounded-xl flex items-center gap-3 shrink-0">
          <Zap className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase">Solde SMS Actuel</div>
            <div className="text-xl font-extrabold text-white">{balance.toLocaleString('fr-FR')} SMS</div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grille des Packs SMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packs.map((pack) => {
          const isSelected = selectedPack?.id === pack.id || selectedPack?._id === pack._id;
          return (
            <div
              key={pack.id || pack._id}
              onClick={() => setSelectedPack(pack)}
              className={`p-6 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 relative ${
                isSelected
                  ? 'bg-purple-600/10 border-purple-500 shadow-xl shadow-purple-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 right-4 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  Recommandé
                </span>
              )}

              <div className="space-y-2">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{pack.label}</span>
                <div className="text-3xl font-black text-white">{pack.smsCount} <span className="text-sm font-normal text-slate-400">SMS</span></div>
                <p className="text-xs text-slate-400">Envoi immédiat via nos routes SMS locales garanties</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-lg font-bold text-emerald-400">{pack.price.toLocaleString('fr-FR')} FCFA</div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-purple-500 bg-purple-500' : 'border-slate-700'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulaire de Rechargement */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Payer le Pack Sélectionné ({selectedPack?.smsCount || 0} SMS)
        </h3>

        <form onSubmit={handleBuy} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Opérateur</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="CM_OM">Orange Money</option>
              <option value="CM_MOMO">MTN Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Numéro Débité</label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="tel"
                required
                placeholder="6XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={purchasing || !phone}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-600/20"
          >
            {purchasing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Payer {selectedPack ? `${selectedPack.price.toLocaleString('fr-FR')} FCFA` : ''}</>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}