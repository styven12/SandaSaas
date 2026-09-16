import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminService.login({ email, password });
      navigate('/admin');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Identifiants administrateur incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 bg-slate-900 border border-amber-500/20 rounded-2xl p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400"><ShieldCheck /></div>
          <h1 className="text-2xl font-bold">Accès Superadmin</h1>
          <p className="text-xs text-slate-400">Administration financière et supervision des gérants</p>
        </div>
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}
        <label className="block text-xs text-slate-400">Email ou identifiant
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
        </label>
        <label className="block text-xs text-slate-400">Mot de passe
          <div className="relative"><Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full p-3 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-white" required /></div>
        </label>
        <button disabled={loading} className="w-full p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}
