import api from './api';

export const supportService = {
  getTickets: async () => {
    const response = await api.get('/support/tickets');
    return response.data;
  },

  createTicket: async (payload) => {
    const response = await api.post('/support/tickets', {
      subject: payload.subject || payload.title,
      initial_message: payload.initial_message || payload.message,
      category: payload.category,
      message_type: payload.message_type,
    });
    return response.data;
  },

  getTicketMessages: async (ticketId) => {
    const response = await api.get(`/support/tickets/${ticketId}`);
    return response.data.messages || response.data;
  },
};
