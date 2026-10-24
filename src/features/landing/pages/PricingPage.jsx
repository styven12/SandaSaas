import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Headphones,
  Menu,
  ShieldCheck,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

export default function PricingPage() {
  const [open, setOpen] = useState(false);

   const links = [
    { name: 'Services', href: '#features' },
    { name: 'Tarifs', href: '/tarifs' },
    { name: 'À propos', href: '/#about' },
  ];

  const advantages = [
    {
      icon: Wifi,
      title: 'Connexion fiable',
      text: 'Infrastructure robuste pour des réseaux WiFi performants, stables et faciles à gérer.',
    },
    {
      icon: ShieldCheck,
      title: 'Sécurité native',
      text: 'Protection des accès, contrôle d’usage et traçabilité des sessions de connexion.',
    },
    {
      icon: Zap,
      title: 'Activation rapide',
      text: 'Délivrance instantanée des accès dès validation du paiement ou du plan choisi.',
    },
    {
      icon: Globe,
      title: 'Gestion multi-zones',
      text: 'Supervisez plusieurs sites et gérez vos offres depuis un seul et même espace.',
    },
    {
      icon: Headphones,
      title: 'Support premium',
      text: 'Une équipe à l’écoute pour accompagner votre croissance et votre activité.',
    },
    {
      icon: Sparkles,
      title: 'Expérience premium',
      text: 'Une interface pensée pour offrir une expérience fluide et professionnelle.',
    },
  ];

  const footerColumns = [
    {
      title: 'Produit',
      links: ['Forfaits', 'Fonctionnalités', 'Sécurité'],
    },
    {
      title: 'Entreprise',
      links: ['À propos', 'Blog', 'Support'],
    },
    {
      title: 'Contact',
      links: ['hello@broadware.io', '+225 00 00 00 00', 'Abidjan, Côte d’Ivoire'],
    },
  ];

  return (
    <div className="landing-page-shell min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-50 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 shadow-[0_15px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-md">
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">Wifisanda</div>
                </div>
              </Link>

              <nav className="hidden items-center gap-8 md:flex">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="hidden items-center gap-3 md:flex">
                <Link
                to="/dashboard"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Tableau de bord
                </Link>
                <Link
                  to="/login"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Connexion
                </Link>
              </div>

              <button
                type="button"
                aria-label="Menu mobile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {open && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 md:hidden">
                <nav className="flex flex-col gap-2">
                  {links.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      {link.name}
                    </a>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Connexion
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>


      <main>
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:pb-16 lg:pt-10">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
              alt="Gestion des zones WiFi Wifisanda"
              className="h-64 w-full object-cover md:h-80"
            />
            <div className="absolute inset-0 bg-slate-950/35" />
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Nos tarifs</p>
              <h1 className="text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl md:text-5xl">
                  Vos zones, vos forfaits, vos prix
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Tarification transparente</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">Vous fixez le prix de vos accès WiFi.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Wifisanda ne vous impose pas de forfait mensuel fictif. Créez vos zones, définissez vos prix en FCFA et gérez vos tickets depuis l’espace professionnel.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm text-slate-700">
              {['Prix par zone', 'Paiement Mobile Money', 'Gestion des tickets'].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">{item}</span>)}
            </div>
            <Link to="/register" className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Créer mon espace</Link>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Avantages</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
              Un service pensé pour faire grandir votre activité
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {advantages.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.03)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="footer" className="mt-10 border-t border-slate-200 bg-white/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-900">{column.title}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-slate-900">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© 2026 Wifisanda. Tous droits réservés.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="transition hover:text-slate-900">CGV</a>
              <a href="#" className="transition hover:text-slate-900">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
