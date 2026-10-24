import React from 'react';
import { authService } from '../../services/authService';
import { LogOut, Menu, User } from 'lucide-react';

export default function Topbar({ setIsOpen }) {
  const tenant = authService.getCurrentTenant();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 backdrop-blur-md sm:px-6">
      
      {/* Bouton Menu Mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Ouvrir le menu de navigation"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="hidden text-sm font-semibold text-slate-300 sm:inline">
          Espace Gérant
        </span>
      </div>

      {/* Profil & Déconnexion */}
      <div className="flex items-center gap-4">
        
        {/* Solde SMS rapide */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs sm:flex">
          <span className="text-slate-400">Solde SMS :</span>
          <span className="font-bold text-indigo-300">{tenant?.sms_balance ?? 0} SMS</span>
        </div>

        {/* Info Gérant */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 font-bold text-indigo-300">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-white">{tenant?.name || 'Gérant'}</div>
            <div className="text-xs text-slate-400">{tenant?.email}</div>
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <button
          onClick={authService.logout}
          title="Se déconnecter"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
