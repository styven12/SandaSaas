import React, { useState } from 'react';
import { Terminal, Copy, Check, X, ShieldAlert } from 'lucide-react';

export default function MikrotikScriptModal({ zone, script, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-4">
        
        {/* En-tête */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Terminal className="w-5 h-5 text-blue-400" />
            <span>Script de Configuration MikroTik - {zone?.name}</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consigne */}
        <div className="px-6 pt-2 space-y-2">
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3 rounded-xl text-xs">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>
              Copiez ce script et collez-le directement dans le **Terminal** de votre routeur MikroTik via Winbox. Il configurera l'URL du portail captif et le jardin fermé (Walled Garden).
            </span>
          </div>
        </div>

        {/* Zone de code */}
        <div className="px-6 py-2">
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap break-all">{script}</pre>
          </div>
        </div>

        {/* Action */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
          <span className="text-xs text-slate-500">DNS Hotspot: {zone?.dnsName || 'hotspot.wifisanda.com'}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié dans le presse-papier !' : 'Copier le script'}
          </button>
        </div>

      </div>
    </div>
  );
}