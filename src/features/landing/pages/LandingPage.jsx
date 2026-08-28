import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  Download 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. BARRE DE NAVIGATION */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Wifi className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Sanda WiFi
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Connexion
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. SECTION HERO (En-tête principal) */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" /> Solution complète pour MikroTik
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Monétisez votre <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Réseau WiFi Zone</span> automatiquement.
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Vendez des tickets d'accès Internet par Mobile Money (Orange, MTN), vérifiez vos utilisateurs par SMS OTP et gérez vos revenus en toute simplicité.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition"
          >
            Démarrer gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition"
          >
            Découvrir la plateforme
          </a>
        </div>
      </section>

      {/* 3. SECTION FONCTIONNALITÉS CLES */}
      <section id="features" className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Tout ce dont votre WiFi Zone a besoin</h2>
            <p className="text-slate-400 mt-2">Une suite d'outils pensée pour maximiser vos revenus sans gestion manuelle.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Paiement Mobile Money</h3>
              <p className="text-slate-400 text-sm">
                Achat de forfaits direct via Mobile Money. Délivrance automatique du ticket MikroTik dès la confirmation du paiement.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="p-3 bg-green-500/10 text-green-400 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Vérification SMS OTP</h3>
              <p className="text-slate-400 text-sm">
                Authentifiez vos clients par code SMS unique. Bloquez les abus et conservez un registre d'accès conforme à la loi.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Comptabilité & Retraits</h3>
              <p className="text-slate-400 text-sm">
                Suivez votre chiffre d'affaires en temps réel et demandez le retrait de vos gains directement sur votre compte Mobile Money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PACKS SMS OTP */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold">Crédits SMS OTP transparents</h2>
          <p className="text-slate-400 mt-2">Rechargez votre solde d'envois SMS selon la taille de votre réseau.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'MINI', sms: '100 SMS', price: '2 000 FCFA' },
            { name: 'STARTER', sms: '500 SMS', price: '8 000 FCFA' },
            { name: 'PRO', sms: '2 000 SMS', price: '25 000 FCFA', popular: true },
            { name: 'BUSINESS', sms: '5 000 SMS', price: '50 000 FCFA' },
          ].map((pack, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl bg-slate-900 border text-center flex flex-col justify-between relative ${
                pack.popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-800'
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                  Populaire
                </span>
              )}
              <div>
                <h3 className="font-bold text-slate-300">{pack.name}</h3>
                <div className="text-3xl font-extrabold my-4 text-white">{pack.price}</div>
                <p className="text-sm text-blue-400 font-semibold">{pack.sms}</p>
              </div>
              <Link 
                to="/register" 
                className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Choisir ce pack
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PIED DE PAGE */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:text-left text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>&copy; 2026 Sanda WiFi Zone. Tous droits réservés.</p>
          <div className="flex justify-center sm:justify-start gap-6">
            <a href="#" className="hover:text-slate-400">Documentation MikroTik</a>
            <a href="#" className="hover:text-slate-400">Support Client</a>
            <a href="#" className="hover:text-slate-400">Canal Telegram</a>
          </div>
        </div>
      </footer>

    </div>
  );
}