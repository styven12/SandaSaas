import React from 'react';
import { authService } from '../../services/authService';
import { LogOut, Menu, User } from 'lucide-react';

export default function Topbar({ setIsOpen }) {
  const tenant = authService.getCurrentTenant();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      
      {/* Bouton Menu Mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
          Espace Gérant
        </span>
      </div>

      {/* Profil & Déconnexion */}
      <div className="flex items-center gap-4">
        
        {/* Solde SMS rapide */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:flex">
          <span className="text-slate-500">Solde SMS :</span>
          <span className="font-bold text-indigo-700">{tenant?.sms_balance ?? 0} SMS</span>
        </div>

        {/* Info Gérant */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 font-bold text-indigo-700">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-slate-900">{tenant?.name || 'Gérant'}</div>
            <div className="text-xs text-slate-500">{tenant?.email}</div>
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
