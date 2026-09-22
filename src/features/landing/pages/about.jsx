import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Globe,
  Headphones,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

export default function AboutPage() {
  const [open, setOpen] = useState(false);

   const links = [
    { name: 'Services', href: '#features' },
    { name: 'Tarifs', href: 'tarifs' },
    { name: 'À propos', href: 'abouts' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Simplicité',
      text: 'Nous concevons des outils simples à comprendre et rapides à utiliser au quotidien.',
    },
    {
      icon: ShieldCheck,
      title: 'Sécurité',
      text: 'La protection des accès, des utilisateurs et des données reste au cœur de notre approche.',
    },
    {
      icon: Zap,
      title: 'Automatisation',
      text: 'Nous automatisons les tâches répétitives afin de vous permettre de vous concentrer sur votre activité.',
    },
  ];

  const commitments = [
    {
      icon: Users,
      title: 'Pensé pour les opérateurs',
      text: 'Broadware est conçu autour des besoins réels des opérateurs de réseaux WiFi et de leurs clients.',
    },
    {
      icon: Globe,
      title: 'Une gestion centralisée',
      text: 'Gérez vos zones, forfaits, paiements et accès depuis un espace unique.',
    },
    {
      icon: Headphones,
      title: 'Une expérience accompagnée',
      text: 'Nous voulons rendre la gestion quotidienne plus claire, plus fluide et plus accessible.',
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

      {/* ================= HEADER ================= */}
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
      
      {/* ================= MAIN ================= */}
      <main>

        {/* ================= HERO IMAGE ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 lg:pb-12 lg:pt-10">

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)]">

            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85"
              alt="Équipe travaillant ensemble"
              className="h-[260] w-full object-cover sm:h-[330] lg:h-[390]"
            />

            <div className="absolute inset-0 bg-slate-950/45" />

            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <div className="max-w-3xl">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  À propos de Broadware
                </div>

                <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                  Nous simplifions la gestion du WiFi.
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                  Une plateforme pensée pour aider les opérateurs à vendre,
                  gérer et développer leurs réseaux WiFi plus simplement.
                </p>

              </div>
            </div>
          </div>
        </section>

        {/* ================= SEPARATOR ================= */}
        <div className="mx-auto h-1 w-44 rounded-full bg-slate-900" />

        {/* ================= WHO WE ARE ================= */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* IMAGE */}
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.07)]">

              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=85"
                alt="Collaboration et technologie"
                className="h-[330] w-full rounded-[22px] object-cover sm:h-[390]"
              />

            </div>

            {/* TEXT */}
            <div className="space-y-6 lg:pl-6">

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                Qui sommes-nous ?
              </div>

              <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
                Une technologie au service d'une gestion plus simple.
              </h2>

              <p className="text-base leading-8 text-slate-600">
                Broadware est une plateforme dédiée à la gestion et à la
                monétisation des réseaux WiFi. Notre objectif est de réunir
                dans un même environnement les outils nécessaires à la vente
                d'accès Internet, à la gestion des forfaits et au suivi de
                l'activité.
              </p>

              <p className="text-base leading-8 text-slate-600">
                Nous voulons réduire la complexité technique afin que les
                opérateurs puissent consacrer davantage de temps au
                développement de leur activité et à leurs clients.
              </p>

              <Link
                to="/tarifs"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(15,23,42,0.15)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Découvrir nos offres
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>
          </div>
        </section>

        {/* ================= SEPARATOR ================= */}
        <div className="mx-auto h-1 w-44 rounded-full bg-slate-900" />

        {/* ================= VALUES ================= */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">

          <div className="mx-auto mb-10 max-w-2xl text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Nos valeurs
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
              Ce qui guide notre façon de construire Broadware.
            </h2>

          </div>

          {/* 3 CARTES */}
          <div className="grid gap-1 md:grid-cols-3">

            {values.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="group bg-slate-900 px-7 py-9 text-white transition duration-300 hover:-translate-y-1 hover:bg-slate-800"
              >

                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-xl font-bold">
                  {title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {text}
                </p>

                <div className="mt-7 h-px w-12 bg-white/40 transition-all duration-300 group-hover:w-20" />

              </article>
            ))}

          </div>
        </section>

        {/* ================= SEPARATOR ================= */}
        <div className="mx-auto h-1 w-44 rounded-full bg-slate-900" />

        {/* ================= COMMITMENTS IMAGE ================= */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)]">

            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=85"
              alt="Technologie et collaboration"
              className="h-[330] w-full object-cover sm:h-[430]"
            />

            <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-950/45 to-transparent" />

            <div className="absolute inset-y-0 left-0 flex max-w-2xl items-center px-7 py-10 sm:px-12">

              <div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  <Wifi className="h-3.5 w-3.5" />
                  Notre engagement
                </div>

                <h2 className="text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                  Construire une expérience WiFi plus intelligente.
                </h2>

                <p className="mt-5 text-base leading-7 text-white/80">
                  Nous cherchons à rendre chaque étape plus claire :
                  configuration des zones, création des forfaits,
                  paiements, délivrance des accès et suivi de l'activité.
                </p>

              </div>

            </div>
          </div>

        </section>

        {/* ================= COMMITMENTS ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-20">

          <div className="grid gap-4 md:grid-cols-3">

            {commitments.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {text}
                </p>

              </div>
            ))}

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
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