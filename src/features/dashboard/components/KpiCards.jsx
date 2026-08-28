import React from 'react';
import { DollarSign, ShoppingBag, Ticket, MessageSquare } from 'lucide-react';

export default function KpiCards({ stats }) {
  const cards = [
    {
      title: 'Chiffre d\'affaires',
      value: `${stats?.totalRevenue?.toLocaleString('fr-FR') || 0} FCFA`,
      subtitle: 'Revenu brut généré',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Ventes Réalisées',
      value: stats?.totalSales || 0,
      subtitle: 'Tickets vendus via le portail',
      icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Stock de Tickets',
      value: stats?.availableTickets || 0,
      subtitle: 'Codes valides disponibles',
      icon: Ticket,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Solde SMS OTP',
      value: stats?.smsBalance || 0,
      subtitle: 'Crédits pour l\'authentification',
      icon: MessageSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className="text-2xl font-bold text-white tracking-tight">{card.value}</div>
              <span className="text-[11px] text-slate-500 block">{card.subtitle}</span>
            </div>
            <div className={`p-3 rounded-xl border ${card.bg} ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}