import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { portalService } from '../../../services/portalService';
import { 
  Wifi, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Loader2, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function CaptivePortalPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Extraction des paramètres transmis automatiquement par le routeur MikroTik
  const mac = searchParams.get('mac') || '';
  const ip = searchParams.get('ip') || '';
  const linkLogin = searchParams.get('link-login') || 'http://wifi.sanda.net/login';

  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // État du formulaire d'achat
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('CM_OM'); // CM_OM ou CM_MOMO
  const [step, setStep] = useState('SELECT_PLAN'); // SELECT_PLAN | PAYING | SUCCESS

  // État après paiement réussi
  const [purchasedTicket, setPurchasedTicket] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Charger les forfaits et infos de la zone
  useEffect(() => {
    const fetchPortal = async () => {
      setLoading(true);
      try {
        const data = await portalService.getPortalInfo(slug);
        setPortalData(data);
        if (data.plans && data.plans.length > 0) {
          setSelectedPlan(data.plans[0]);
        }
      } catch (err) {
        setError("Impossible de charger les forfaits pour cette zone WiFi.");
      } finally {
        setLoading(false);
      }
    };
    fetchPortal();
  }, [slug]);

  // Gestion de la commande & paiement
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setPaymentLoading(true);
    setError('');

    try {
      const res = await portalService.initiatePayment({
        zoneId: portalData?.zone?._id || portalData?.zone?.id,
        planId: selectedPlan._id || selectedPlan.id,
        phone,
        provider,
        mac,
        ip
      });

      setStep('PAYING');
      
      // Polling de vérification du statut du paiement Mobile Money (max 45 secondes)
      pollTransactionStatus(res.reference);
    } catch (err) {
      setError(err.response?.data?.error || "Échec de l'initialisation du paiement.");
      setPaymentLoading(false);
    }
  };

  const pollTransactionStatus = (txId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const res = await portalService.checkPaymentStatus(txId);
        if (res.status === 'complete') {
          clearInterval(interval);
          setPurchasedTicket(res.ticket);
          setStep('SUCCESS');
          setPaymentLoading(false);
        } else if (res.status === 'failed') {
          clearInterval(interval);
          setError("Paiement échoué ou annulé sur votre téléphone.");
          setStep('SELECT_PLAN');
          setPaymentLoading(false);
        }
      } catch (err) {
        console.error(err);
      }

      if (attempts >= 15) { // Arrêt après 45s (15 x 3s)
        clearInterval(interval);
        setError("Temps d'attente dépassé. Si le montant a été débité, vérifiez vos SMS.");
        setStep('SELECT_PLAN');
        setPaymentLoading(false);
      }
    }, 3000);
  };

  const handleCopyCode = () => {
    if (purchasedTicket?.code) {
      navigator.clipboard.writeText(purchasedTicket.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400">Chargement de votre zone WiFi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 max-w-md mx-auto">
      
      {/* EN-TÊTE DU PORTAIL */}
      <header className="text-center space-y-2 pt-4">
        <div className="inline-flex p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/30">
          <Wifi className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">
          {portalData?.zone?.name || 'WiFi High-Speed'}
        </h1>
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Connexion Internet Sécurisée & Rapide
        </p>
      </header>

      {/* MESSAGE D'ERREUR */}
      {error && (
        <div className="my-3 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ÉTAPE 1 : SELECTION DU FORFAIT ET PAIEMENT */}
      {step === 'SELECT_PLAN' && (
        <main className="space-y-5 my-4">
          
          {/* Liste des Forfaits */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
              1. Choisissez votre forfait
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {portalData?.plans?.map((plan) => {
                const isSelected = selectedPlan?._id === plan._id || selectedPlan?.id === plan.id;
                return (
                  <div
                    key={plan._id || plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm flex items-center gap-2">
                        <span>{plan.name}</span>
                        {plan.badge && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {plan.duration}</span>
                        <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {plan.speed || 'Haut Débit'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-400">{plan.price} FCFA</div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ml-auto mt-1 ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-700'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulaire de Paiement Mobile Money */}
          <form onSubmit={handlePayment} className="space-y-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              2. Numéro Mobile Money
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('CM_OM')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  provider === 'CM_OM'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Orange Money
              </button>
              <button
                type="button"
                onClick={() => setProvider('CM_MOMO')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  provider === 'CM_MOMO'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                MTN MoMo
              </button>
            </div>

            <div className="relative">
              <Smartphone className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                placeholder="6XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={paymentLoading || !phone}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30"
            >
              {paymentLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Payer {selectedPlan ? `${selectedPlan.price} FCFA` : ''}</>
              )}
            </button>
          </form>

        </main>
      )}

      {/* ÉTAPE 2 : ATTENTE DU PAIEMENT EN COURS */}
      {step === 'PAYING' && (
        <main className="my-auto text-center space-y-4 py-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="relative inline-flex">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 animate-pulse">
              <Smartphone className="w-8 h-8" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">Validation sur votre téléphone</h3>
            <p className="text-xs text-slate-400">
              Tapez votre code secret Mobile Money sur la notification envoyée au <span className="font-mono text-white">{phone}</span>.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>En attente de confirmation...</span>
          </div>
        </main>
      )}

      {/* ÉTAPE 3 : PAIEMENT RÉUSSI & CODE TICKET */}
      {step === 'SUCCESS' && (
        <main className="my-auto space-y-4 py-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-lg">Paiement Confirmé !</h3>
              <p className="text-xs text-slate-400">Voici votre code d'accès WiFi personnel</p>
            </div>

            {/* Ticket Affiché */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Code WiFi / Ticket</div>
              <div className="text-3xl font-black font-mono text-emerald-400 tracking-wider select-all">
                {purchasedTicket?.code || 'WIFI88'}
              </div>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié !' : 'Copier le code'}
              </button>
            </div>

            {/* Bouton Connexion Automatique MikroTik */}
            <form action={linkLogin} method="post" className="pt-2">
              <input type="hidden" name="username" value={purchasedTicket?.code || ''} />
              <input type="hidden" name="password" value={purchasedTicket?.password || purchasedTicket?.code || ''} />
              <input type="hidden" name="dst" value="https://google.com" />
              
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/30"
              >
                <Wifi className="w-5 h-5" /> Se Connecter à Internet
              </button>
            </form>

          </div>
        </main>
      )}

      {/* PIED DE PAGE PORTAIL */}
      <footer className="text-center py-2 text-[11px] text-slate-500 border-t border-slate-900">
        Propulsé par <span className="font-semibold text-slate-400">Sanda WiFi SaaS</span>
      </footer>

    </div>
  );
}