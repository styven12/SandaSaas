import API from './api';

export const settingsService = {
  // Récupérer les paramètres actuels du gérant
  getSettings: async () => {
    const response = await API.get('/tenant/settings');
    return response.data;
  },

  // Mettre à jour le profil & configurations de paiement
  updateSettings: async (settingsData) => {
    const response = await API.put('/tenant/settings', settingsData);
    return response.data;
  },

  // Changer le mot de passe
  updatePassword: async (passwordData) => {
    const response = await API.put('/tenant/change-password', passwordData);
    return response.data;
  }
};