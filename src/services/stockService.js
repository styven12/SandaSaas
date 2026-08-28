import API from './api';

export const stockService = {
  // Récupérer la liste des tickets
  getTickets: async (params = {}) => {
    const response = await API.get('/tickets', { params });
    return response.data;
  },

  // Importer un fichier CSV de tickets
  uploadCsv: async (formData) => {
    const response = await API.post('/tickets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Supprimer un ticket
  deleteTicket: async (ticketId) => {
    const response = await API.delete(`/tickets/${ticketId}`);
    return response.data;
  }
};