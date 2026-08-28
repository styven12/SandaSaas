import API from './api';

export const zoneService = {
  // Récupérer toutes les zones du gérant
  getZones: async () => {
    const response = await API.get('/zones');
    return response.data;
  },

  // Créer une nouvelle zone
  createZone: async (zoneData) => {
    const response = await API.post('/zones', zoneData);
    return response.data;
  },

  // Récupérer le script MikroTik généré pour une zone
  getMikrotikScript: async (zoneId) => {
    const response = await API.get(`/zones/${zoneId}/mikrotik-script`);
    return response.data;
  },

  // Supprimer une zone
  deleteZone: async (zoneId) => {
    const response = await API.delete(`/zones/${zoneId}`);
    return response.data;
  }
};