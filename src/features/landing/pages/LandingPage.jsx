import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  Menu,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: 'Services', href: '#features' },
    { name: 'Tarifs', href: 'tarifs' },
    { name: 'À propos', href: 'abouts' },
  ];

  const featureCards = [
    {
      icon: Wifi,
      title: 'Gestion centralisée',
      text: 'Contrôlez vos zones, forfaits et accès depuis un tableau de bord unique.',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: Smartphone,
      title: 'Paiements simples',
      text: 'Recevez les paiements via Mobile Money et délivrez les accès immédiatement.',
      color: 'bg-violet-100 text-violet-700',
    },
    {
      icon: ShieldCheck,
      title: 'Sécurité renforcée',
      text: 'Accès personnalisés, contrôle des sessions et suivi des activités en temps réel.',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: TrendingUp,
      title: 'Pilotage business',
      text: 'Analysez vos revenus, la conversion et la performance de vos réseaux WiFi.',
      color: 'bg-amber-100 text-amber-700',
    },
  ];

  const offerCards = [
    {
      image:
        'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80',
      title: 'Bots de captation',
      text: 'Collectez des contacts et donnez accès à des audiences qualifiées grâce aux campagnes d’acquisition.',
      tag: 'Acquisition',
    },
    {
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
      title: 'Vente d’accès',
      text: 'Créez des forfaits, activez les paiements et délivrez les identifiants en quelques secondes.',
      tag: 'Monétisation',
    },
    {
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      title: 'Support client',
      text: 'Suivez les demandes, les incidents et les tickets clients pour une expérience plus fluide.',
      tag: 'Service',
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
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-50 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 shadow-[0_15px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-md">
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">Broadware</div>
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
                  Dashbord
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
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-[520] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_30%)]" />

          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr]">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
                  <Zap className="h-3.5 w-3.5" />
                  Solution complète pour WiFi Zone
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-xl text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
                    Monétisez votre réseau WiFi sans friction.
                  </h1>
                  <p className="max-w-lg text-lg leading-8 text-slate-600">
                    Vendez des accès Internet, automatisez les paiements et pilotez votre activité depuis une plateforme professionnelle pensée pour les opérateurs de WiFi public.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-base font-semibold text-white shadow-[0_18px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Démarrer gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Découvrir la plateforme
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-7 pt-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-4 w-4" />
                    </div>
                    Paiements sécurisés
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    Suivi en temps réel
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-5 top-6 h-32 w-32 rounded-full bg-indigo-200/50 blur-3xl" />
                <div className="absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-cyan-200/60 blur-3xl" />

                <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-slate-950 p-5 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Chiffre d'affaires</div>
                      <div className="mt-1 text-2xl font-bold text-white">24 840 FCFA</div>
                    </div>
                    <div className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      +18.4%
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-300">Performance</div>
                      <div className="text-xs text-slate-400">Aujourd'hui</div>
                    </div>

                    <div className="flex h-28 items-end gap-2">
                      {[42, 64, 58, 75, 96, 72, 100].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-xl bg-linear-to-t from-indigo-500 to-cyan-400" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                      <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Tickets</div>
                      <div className="mt-2 text-2xl font-bold text-white">184</div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                      <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Clients</div>
                      <div className="mt-2 text-2xl font-bold text-white">1 248</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid grid-cols-2 gap-4">
                {featureCards.map(({ icon: Icon, title, text, color }) => (
                  <div key={title} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                ))}
              </div>

              <div id="about" className="space-y-6 lg:pl-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  Pourquoi nos clients nous font confiance
                </div>

                <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
                  Une plateforme de vente et de gestion conçue pour la croissance durable.
                </h2>

                <p className="text-base leading-8 text-slate-600">
                  Broadware centralise les paiements, l’accès client, le suivi des performances et la gestion des tickets pour vous offrir un cadre clair et scalable.
                </p>

                <div className="space-y-4">
                  {[
                    'Automatisation complète des achats de forfaits et des identifiants.',
                    'Pilotage de la rentabilité avec un tableau de bord clair et exploitable.',
                    'Support proactif pour optimiser vos zones de vente et la délivrance des accès.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
                  Pilotage intelligent
                </div>

                <h2 className="max-w-md text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
                  Comprenez vos performances d’un simple coup d’œil.
                </h2>

                <p className="max-w-lg text-base leading-8 text-slate-600">
                  Analysez les revenus, la conversion, le volume des ventes et l’engagement des clients pour ajuster votre stratégie et maximiser votre rentabilité.
                </p>

                <div className="space-y-3">
                  {[
                    { label: 'Taux de conversion', value: '+34%' },
                    { label: 'Marge moyenne', value: '72%' },
                    { label: 'Temps de setup', value: '5 min' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="text-lg font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                  alt="Tableau de bord de gestion WiFi"
                  className="h-[420] w-full rounded-[24] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">Nos offres</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
                Des outils pensés pour chaque étape de votre activité.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {offerCards.map((card) => (
                <article
                  key={card.title}
                  className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-6">
                    <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {card.tag}
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
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
            <p>© 2026 Broadware. Tous droits réservés.</p>
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
