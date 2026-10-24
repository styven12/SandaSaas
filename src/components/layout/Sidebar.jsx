import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Wifi, 
  LayoutDashboard, 
  Radio, 
  Ticket, 
  ListChecks,
  Wallet, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  Settings 
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  // Liste des items de navigation
  const navItems = [
    { label: 'Vue d\'ensemble', path: '/dashboard/overview', icon: LayoutDashboard },
    { label: 'Zones & Bornes', path: '/dashboard/zones', icon: Radio },
    { label: 'Forfaits', path: '/dashboard/plans', icon: ListChecks },
    { label: 'Stock de Tickets', path: '/dashboard/stock', icon: Ticket },
    { label: 'Comptabilité & Retraits', path: '/dashboard/finance', icon: Wallet },
    { label: 'Boutique SMS', path: '/dashboard/sms', icon: MessageSquare },
    { label: 'Registre Légal', path: '/dashboard/logs', icon: FileText },
    { label: 'Support Client', path: '/dashboard/support', icon: HelpCircle },
    { label: 'Paramètres', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-200 bg-white transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        {/* LOGO */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="rounded-xl bg-slate-900 p-2 text-white shadow-md">
            <Wifi className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Wifisanda
          </span>
        </div>

        {/* MENU DE NAVIGATION */}
        <nav className="space-y-1.5 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* PIED DE LA SIDEBAR */}
      <div className="border-t border-slate-200 p-4 text-center text-xs text-slate-500">
        Wifisanda · Espace professionnel
      </div>
    </aside>
  );
}
