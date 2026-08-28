import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Wifi, 
  LayoutDashboard, 
  Radio, 
  Ticket, 
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
    { label: 'Stock de Tickets', path: '/dashboard/stock', icon: Ticket },
    { label: 'Comptabilité & Retraits', path: '/dashboard/finance', icon: Wallet },
    { label: 'Boutique SMS OTP', path: '/dashboard/sms', icon: MessageSquare },
    { label: 'Registre Légal', path: '/dashboard/logs', icon: FileText },
    { label: 'Support Client', path: '/dashboard/support', icon: HelpCircle },
    { label: 'Paramètres', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        {/* LOGO */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-600/20">
            <Wifi className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Sanda WiFi
          </span>
        </div>

        {/* MENU DE NAVIGATION */}
        <nav className="p-4 space-y-1.5">
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
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Sanda WiFi Zone v1.0.0
      </div>
    </aside>
  );
}