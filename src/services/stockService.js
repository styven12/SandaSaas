import API from './api';

export const stockService = {
  // Récupérer la liste des tickets
  getTickets: async (params = {}) => {
    const response = await API.get('/tickets', { params });
    return response.data;
  },

  // Importer un fichier CSV de tickets
  uploadCsv: async (formData) => {
    const response = await API.post('/tickets/import', formData);
    return response.data;
  },

  // Supprimer un ticket
  deleteTicket: async (ticketId) => {
    const response = await API.delete(`/tickets/${ticketId}`);
    return response.data;
  },

  // Créer un forfait (plan)
  createPlan: async (wifi_zone_id, name, price) => {
    const response = await API.post('/plans', {
      wifi_zone_id,
      name,
      price,
    });
    return response.data;
  },

  // Récupérer les forfaits d'une zone
  getPlansByZone: async (wifi_zone_id) => {
    const response = await API.get(`/plans/zone/${wifi_zone_id}`);
    return response.data;
  },
};