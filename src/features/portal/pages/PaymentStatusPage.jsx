import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowLeft, 
  Wifi, 
  HelpCircle 
} from 'lucide-react';
import { portalService } from '../../../services/portalService';

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState('pending'); // 'pending' | 'complete' | 'failed'
  const [ticket, setTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [polling, setPolling] = useState(true);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setErrorMessage("Référence de transaction manquante.");
      setPolling(false);
      return;
    }

    let intervalId;
    let attempts = 0;
    const maxAttempts = 15; // Interroge pendant ~30 secondes max (toutes les 2s)

    const checkStatus = async () => {
      try {
        attempts += 1;
        const data = await portalService.checkPaymentStatus(reference);

        if (data.status === 'complete' && data.ticket) {
          setStatus('complete');
          setTicket(data.ticket);
          setPolling(false);
          clearInterval(intervalId);
        } else if (data.status === 'failed' || data.status === 'canceled') {
          setStatus('failed');
          setErrorMessage(data.message || "Le paiement Mobile Money a été rejeté ou annulé.");
          setPolling(false);
          clearInterval(intervalId);
        } else if (attempts >= maxAttempts) {
          // Timeout si le statut reste pending trop longtemps
          setStatus('pending');
          setPolling(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          setStatus('failed');
          setErrorMessage("Impossible de vérifier l'état du paiement. Veuillez contacter le support.");
          setPolling(false);
          clearInterval(intervalId);
        }
      }
    };

    // Premier contrôle immédiat
    checkStatus();

    // Polling toutes les 2 secondes
    intervalId = setInterval(checkStatus, 2000);

    return () => clearInterval(intervalId);
  }, [reference]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-brand-500/10 text-brand-400 rounded-2xl mb-1">
            <Wifi size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">Statut du Paiement</h2>
          {reference && (
            <p className="text-[11px] font-mono text-slate-500">Réf: {reference}</p>
          )}
        </div>

        {/* ECRAN 1 : PENDING (En cours de confirmation) */}
        {status === 'pending' && (
          <div className="space-y-6 text-center py-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
              <Clock size={24} className="text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Validation en cours...</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Veuillez valider le retrait sur votre téléphone portable (USSD Orange Money ou MTN MoMo).
              </p>
            </div>

            {!polling && (
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
              >
                <RefreshCw size={14} /> Recontrôler le statut
              </button>
            )}
          </div>
        )}

        {/* ECRAN 2 : COMPLETE (Paiement réussi + affichage du ticket) */}
        {status === 'complete' && ticket && (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center space-y-2">
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-green-400">Paiement Confirmé !</h3>
              <p className="text-xs text-slate-300">
                Votre pass WiFi est prêt. Entrez les identifiants ci-dessous sur le portail MikroTik.
              </p>
            </div>

            {/* Carte Identifiants */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-500 block">Identifiant</span>
                  <span className="text-lg font-bold text-brand-400">{ticket.username}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(ticket.username, 'usr')}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
                >
                  {copiedField === 'usr' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-500 block">Mot de passe</span>
                  <span className="text-lg font-bold text-brand-400">{ticket.password}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(ticket.password, 'pwd')}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
                >
                  {copiedField === 'pwd' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 text-slate-400 text-xs flex items-start gap-2.5">
              <HelpCircle size={16} className="text-brand-400 shrink-0 mt-0.5" />
              <span>
                Conseil : Prenez une capture d'écran de vos identifiants pour ne pas les perdre.
              </span>
            </div>
          </div>
        )}

        {/* ECRAN 3 : FAILED (Échec ou annulation) */}
        {status === 'failed' && (
          <div className="space-y-6 text-center py-2">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Paiement Non Finalisé</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {errorMessage || "Le paiement n'a pas pu être traité ou a été refusé."}
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Réessayer une autre transaction
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          En cas de souci, contactez le gérant du réseau avec la référence <span className="font-mono text-slate-400">{reference || 'N/A'}</span>.
        </div>
      </div>
    </div>
  );
}