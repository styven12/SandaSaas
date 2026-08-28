import React from 'react';
import { authService } from '../../services/authService';
import { LogOut, Menu, User, Bell } from 'lucide-react';

export default function Topbar({ setIsOpen }) {
  const tenant = authService.getCurrentTenant();

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      
      {/* Bouton Menu Mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="p-2 text-slate-400 hover:text-white rounded-lg md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold text-slate-300 hidden sm:inline">
          Espace Gérant
        </span>
      </div>

      {/* Profil & Déconnexion */}
      <div className="flex items-center gap-4">
        
        {/* Solde SMS rapide */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-xs">
          <span className="text-slate-400">Solde SMS :</span>
          <span className="font-bold text-blue-400">{tenant?.sms_balance ?? 0} SMS</span>
        </div>

        {/* Info Gérant */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 font-bold">
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
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}