import React, { useEffect, useState } from 'react';
import { LogOut, RefreshCw, ShieldCheck, Wallet, Users, MessageSquare, Activity } from 'lucide-react';
import { adminService } from '../../../services/adminService';

const money = (value) => `${Number(value || 0).toLocaleString('fr-FR')} FCFA`;

export default function AdminDashboardPage() {
  const [data, setData] = useState({ tenants: [], stats: {}, activities: [] });
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try { setData(await adminService.getOverview()); } catch (requestError) { setError(requestError.response?.data?.error || 'Erreur de chargement.'); }
  };
  useEffect(() => { load(); }, []);

  const submitPayout = async (event) => {
    event.preventDefault(); setError(''); setMessage('');
    try {
      const result = await adminService.createPayout({ amount: Number(amount), phone_number: phone, payment_method: 'mobile_money' });
      setMessage(`Retrait créé. Disponible restant : ${money(result.available)}`); setAmount(''); await load();
    } catch (requestError) { setError(requestError.response?.data?.error || 'Retrait impossible.'); }
  };

  const updateCredentials = async (event) => {
    event.preventDefault(); setError('');
    try { await adminService.updateCredentials(credentials); setMessage('Identifiants mis à jour.'); setCredentials({ email: '', password: '' }); }
    catch (requestError) { setError(requestError.response?.data?.error || 'Modification impossible.'); }
  };

  const stats = data.stats || {};
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6">
      <header className="flex flex-wrap gap-3 items-center justify-between">
        <div><p className="text-amber-400 text-xs uppercase font-bold tracking-widest">Superadmin</p><h1 className="text-2xl font-bold">Centre de supervision</h1></div>
        <div className="flex gap-2"><button onClick={load} className="p-2 rounded-xl bg-slate-800"><RefreshCw className="w-4 h-4" /></button><button onClick={adminService.logout} className="p-2 rounded-xl bg-red-500/10 text-red-400"><LogOut className="w-4 h-4" /></button></div>
      </header>
      {message && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{message}</div>}
      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[[Users, 'Gérants', data.tenants.length], [MessageSquare, 'Ventes SMS', money(stats.smsRevenue)], [Wallet, 'Retraits admin', money(stats.adminWithdrawn)], [Activity, 'Taux retiré SMS', `${stats.withdrawalRate || 0}%`], [ShieldCheck, 'Revenus WiFi', money(stats.wifiRevenue)]].map(([Icon, label, value]) => <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4"><Icon className="w-4 h-4 text-amber-400 mb-3" /><p className="text-xs text-slate-500">{label}</p><p className="text-lg font-bold">{value}</p></div>)}
      </section>
      <section className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submitPayout} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"><h2 className="font-bold">Retirer les revenus SMS</h2><p className="text-xs text-slate-500">Les achats de packs SMS sont séparés des wallets des gérants.</p><input type="number" min="1000" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Montant FCFA" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700" required /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Numéro Mobile Money" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700" required /><button className="w-full p-3 rounded-xl bg-amber-500 text-slate-950 font-bold">Créer le retrait</button></form>
        <form onSubmit={updateCredentials} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"><h2 className="font-bold">Modifier les identifiants</h2><input type="text" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} placeholder="Nouvel email ou identifiant" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700" required /><input type="password" minLength="8" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="Nouveau mot de passe" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700" required /><button className="w-full p-3 rounded-xl bg-slate-700 font-bold">Enregistrer</button></form>
      </section>
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-x-auto"><h2 className="font-bold mb-4">Gérants et mouvements</h2><table className="w-full text-left text-xs"><thead className="text-slate-500 uppercase"><tr><th className="p-2">Gérant</th><th className="p-2">Revenus SMS</th><th className="p-2">Revenus WiFi</th><th className="p-2">Retraits</th><th className="p-2">Taux retiré</th><th className="p-2">Solde SMS</th></tr></thead><tbody>{data.tenants.map((tenant) => <tr key={tenant.id} className="border-t border-slate-800"><td className="p-2"><b>{tenant.name}</b><br /><span className="text-slate-500">{tenant.email}</span></td><td className="p-2 text-emerald-400">{money(tenant.sms_revenue)}</td><td className="p-2">{money(tenant.wifi_revenue)}</td><td className="p-2 text-amber-400">{money(tenant.tenant_withdrawn)}</td><td className="p-2">{tenant.withdrawal_rate}%</td><td className="p-2">{tenant.sms_balance}</td></tr>)}</tbody></table></section>
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5"><h2 className="font-bold mb-4">Registre des activités</h2><div className="space-y-2 max-h-80 overflow-auto">{data.activities.map((activity) => <div key={activity.id} className="flex justify-between gap-4 border-b border-slate-800 pb-2 text-xs"><span>{activity.action} <span className="text-slate-500">{activity.target_type || ''} #{activity.target_id || ''}</span></span><time className="text-slate-500 whitespace-nowrap">{new Date(activity.created_at).toLocaleString('fr-FR')}</time></div>)}</div></section>
    </main>
  );
}
