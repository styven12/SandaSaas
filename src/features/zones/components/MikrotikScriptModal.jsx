import React, { useState } from 'react';
import { Terminal, Copy, Check, X, ShieldAlert, Download } from 'lucide-react';

export default function MikrotikScriptModal({ zone, script, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const file = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wifisanda-${zone?.slug || 'mikrotik'}.rsc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="mikrotik-title" className="w-full max-w-2xl space-y-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3 font-semibold text-slate-900">
            <Terminal className="h-5 w-5 text-indigo-600" />
            <span id="mikrotik-title">Configuration MikroTik · {zone?.name}</span>
          </div>
          <button aria-label="Fermer" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consigne */}
        <div className="px-6 pt-2 space-y-2">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>
              Vérifiez le nom DNS et l’adresse du portail avant exécution. Collez les commandes dans le Terminal Winbox ou importez le fichier .rsc. Un Hotspot MikroTik doit déjà être créé sur le routeur.
            </span>
          </div>
        </div>

        {/* Zone de code */}
        <div className="px-6 py-2">
          <div className="relative max-h-[55vh] overflow-y-auto rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs text-emerald-300">
            <pre className="whitespace-pre-wrap break-words">{script}</pre>
          </div>
        </div>

        {/* Action */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">Le portail est généré avec le domaine Wifisanda configuré.</span>
          <div className="flex gap-2">
          <button type="button" onClick={handleDownload} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
            <Download className="h-4 w-4" /> Télécharger .rsc
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié dans le presse-papier !' : 'Copier le script'}
          </button>
          </div>
        </div>

      </div>
    </div>
  );
}
