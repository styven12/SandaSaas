import React, { useState, useEffect } from 'react';
import { settingsService } from '../../../services/settingsService';
import { authService } from '../../../services/authService';
import { 
  Settings, 
  User, 
  Wallet, 
  Lock, 
  Store, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save 
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notifications
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Formulaire Profil & Configuration
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    brandName: '',
    payoutPhone: '',
    defaultProvider: 'CM_OM'
  });

  // Formulaire Mot de Passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getSettings();
        const tenant = authService.getCurrentTenant();

        setProfileData({
          name: data.name || tenant?.name || '',
          email: data.email || tenant?.email || '',
          brandName: data.brandName || data.name || '',
          payoutPhone: data.payoutPhone || '',
          defaultProvider: data.defaultProvider || 'CM_OM'
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      await settingsService.updateSettings(profileData);
      setProfileMsg({ type: 'success', text: 'Paramètres mis à jour avec succès !' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.error || 'Erreur lors de la mise à jour.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);

    try {
      await settingsService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMsg({ type: 'success', text: 'Mot de passe modifié avec succès !' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.error || 'Erreur lors du changement de mot de passe.' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" /> Paramètres du Compte
        </h1>
        <p className="text-xs text-slate-400">Gérez votre profil gérant, vos coordonnées de retrait et la sécurité de votre accès</p>
      </div>

      {/* SECTION 1 : INFORMATIONS DE COMPTE & PAIEMENTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" /> Profil Gérant & Comptes de Retrait
        </h3>

        {profileMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            profileMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nom complet ou Entreprise</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Adresse Email</label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nom commercial (Affiché sur le Portail)</label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ex: Sanda Akwa WiFi"
                  value={profileData.brandName}
                  onChange={(e) => setProfileData({ ...profileData, brandName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Numéro Mobile Money par Défaut (Retraits)</label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={profileData.payoutPhone}
                  onChange={(e) => setProfileData({ ...profileData, payoutPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer le profil
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2 : SÉCURITÉ & MOT DE PASSE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" /> Sécurité du Compte
        </h3>

        {passwordMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            passwordMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                required
                minLength="6"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                minLength="6"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-600/20"
            >
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Modifier le mot de passe
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}