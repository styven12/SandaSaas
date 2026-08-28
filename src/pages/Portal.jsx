import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { Wifi, Phone, ShieldCheck, CreditCard, Ticket, CheckCircle, Loader2 } from 'lucide-react';

export default function Portal() {
  const { slug } = useParams(); // Slug de la zone WiFi

  // États du flux
  const [step, setStep] = useState(1); // 1: Forfaits, 2: OTP, 3: Paiement, 4: Succès/Ticket
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Données
  const [zone, setZone] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Saisie utilisateur
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [issuedTicket, setIssuedTicket] = useState(null);

  // Charger les données de la zone et ses forfaits
  useEffect(() => {
    fetchPortalData();
  }, [slug]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/portal/${slug}`);
      setZone(res.data.zone);
      setPlans(res.data.plans || []);
    } catch (err) {
      setError('Impossible de charger les informations du portail.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Envoi du Code OTP par SMS
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phone) return setError('Veuillez entrer un numéro de téléphone valide.');
    
    setError('');
    setLoading(true);
    try {
      await API.post('/otp/request-otp', { phone, zone_id: zone.id });
      setStep(2); // Passer à la saisie de l'OTP
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi du SMS.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Vérification du Code OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return setError('Veuillez saisir le code reçu par SMS.');

    setError('');
    setLoading(true);
    try {
      await API.post('/otp/verify-otp', { phone, code: otpCode });
      setIsPhoneVerified(true);
      // Passer directement au paiement après vérification
      initiatePayment();
    } catch (err) {
      setError(err.response?.data?.error || 'Code OTP incorrect ou expiré.');
      setLoading(false);
    }
  };

  // 3. Initialisation du Paiement Notch Pay
  const initiatePayment = async () => {
    setLoading(true);
    try {
      const res = await API.post('/payments/initiate', {
        plan_id: selectedPlan.id,
        phone: phone
      });

      setTransactionRef(res.data.reference);
      
      // Redirection vers le guichet Mobile Money Notch Pay
      window.location.href = res.data.payment_url;
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur d\'initialisation du paiement.');
      setLoading(false);
    }
  };

  // 4. Vérifier si le client revient d'un paiement réussi
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ref = query.get('reference');
    if (ref) {
      checkPaymentStatus(ref);
    }
  }, []);

  const checkPaymentStatus = async (ref) => {
    setStep(4);
    setLoading(true);
    try {
      const res = await API.get(`/payments/status/${ref}`);
      if (res.data.status === 'complete') {
        setIssuedTicket(res.data.ticket);
      } else {
        setError('Le paiement est toujours en cours de traitement ou a échoué.');
      }
    } catch (err) {
      setError('Erreur lors de la récupération de votre ticket.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !zone) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-2" />
        <p>Chargement du portail WiFi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 max-w-md mx-auto">
      {/* En-tête */}
      <header className="text-center my-6">
        <div className="inline-flex p-3 bg-blue-600/20 text-blue-400 rounded-full mb-3">
          <Wifi className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">{zone?.name || 'Zone WiFi'}</h1>
        <p className="text-sm text-slate-400">Connectez-vous à Internet en quelques clics</p>
      </header>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-4 text-center">
          {error}
        </div>
      )}

      {/* ÉTAPE 1 : Choix du Forfait */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            1. Choisissez votre forfait
          </h2>
          <div className="grid gap-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  selectedPlan?.id === plan.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-xs text-slate-400">{plan.duration_minutes} Minutes d'accès</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-blue-400">{plan.price}</span>
                  <span className="text-xs text-slate-400 ml-1">XAF</span>
                </div>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <form onSubmit={handleRequestOtp} className="mt-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Numéro Mobile Money (Orange / MTN)
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="6XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl text-white flex items-center justify-center gap-2 transition"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuer vers la vérification'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ÉTAPE 2 : Validation OTP par SMS */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center">
            <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Vérification SMS</h2>
            <p className="text-xs text-slate-400 mt-1">
              Un code à 6 chiffres a été envoyé au <span className="text-white font-semibold">{phone}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              required
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full text-center text-2xl tracking-widest py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl text-white flex items-center justify-center gap-2 transition"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Valider et Payer'}
            </button>
          </form>
        </div>
      )}

      {/* ÉTAPE 4 : Affichage du Ticket Obtenu */}
      {step === 4 && (
        <div className="space-y-6 text-center">
          {issuedTicket ? (
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold">Paiement Confirmé !</h2>
              <p className="text-xs text-slate-400 mt-1">Voici vos accès pour vous connecter au WiFi</p>

              <div className="my-6 p-4 bg-slate-900 rounded-xl border border-slate-700/50 space-y-3">
                <div>
                  <span className="text-xs text-slate-500 block uppercase">Identifiant</span>
                  <span className="text-lg font-mono font-bold text-blue-400">{issuedTicket.username}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block uppercase">Mot de passe</span>
                  <span className="text-lg font-mono font-bold text-blue-400">{issuedTicket.password}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(issuedTicket.username);
                  alert('Identifiant copié !');
                }}
                className="w-full bg-slate-700 hover:bg-slate-600 font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" /> Copier les identifiants
              </button>
            </div>
          ) : (
            <div className="py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-sm">Validation du paiement en cours...</p>
            </div>
          )}
        </div>
      )}

      {/* Pied de page */}
      <footer className="text-center text-xs text-slate-500 mt-8 py-4 border-t border-slate-800">
        Propulsé par <span className="font-semibold text-slate-400">Sanda WiFi Zone</span>
      </footer>
    </div>
  );
}