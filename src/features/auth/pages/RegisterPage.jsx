import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Wifi, Mail, Lock, Phone, User, Loader2, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      // Connexion automatique après inscription
      await authService.login({ email: formData.email, password: formData.password });
      navigate('/dashboard/overview');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* En-tête */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex p-3 bg-blue-600 rounded-2xl text-white mb-2 shadow-lg shadow-blue-600/20">
            <Wifi className="w-8 h-8" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Créer un Compte Gérant</h2>
          <p className="text-xs text-slate-400">Lancez et monétisez votre réseau WiFi en 2 minutes</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nom du Réseau / Gérant</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                name="name"
                required
                placeholder="Ex: Sanda WiFi Douala"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                name="email"
                required
                placeholder="gerant@domaine.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Téléphone (Mobile Money)</label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="tel"
                name="phone"
                required
                placeholder="6XX XXX XXX"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 font-semibold py-2.5 rounded-xl text-sm text-white flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Créer mon compte <CheckCircle className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Pied de formulaire */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
}