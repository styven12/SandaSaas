import { Link } from 'react-router-dom';

export default function LegalPlaceholderPage({ title }) {
  return (
    <main className="landing-page-shell min-h-screen bg-[#f5f7fb] px-4 py-16 text-slate-900 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <Link to="/" className="text-sm font-semibold text-indigo-700">← Wifisanda</Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Information juridique</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-5 leading-7 text-slate-600">Ce document est en cours de préparation. Cette page temporaire ne constitue pas encore les conditions contractuelles ni la politique de confidentialité de Wifisanda.</p>
        <a href="mailto:hello@broadware.io" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Contacter Wifisanda</a>
      </section>
    </main>
  );
}
