import api from './api';

export const supportService = {
  getTickets: async () => {
    const response = await api.get('/api/support/tickets');
    return response.data;
  },

  createTicket: async (payload) => {
    const response = await api.post('/api/support/tickets', payload);
    return response.data;
  },

  getTicketMessages: async (ticketId) => {
    const response = await api.get(`/api/support/tickets/${ticketId}/messages`);
    return response.data;
  },
};
