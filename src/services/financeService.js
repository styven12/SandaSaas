import API from './api';

export const financeService = {
  // Récupérer le solde et les statistiques financières
  getBalance: async () => {
    const response = await API.get('/finance/balance');
    return response.data;
  },

  // Récupérer l'historique des retraits
  getPayouts: async () => {
    const response = await API.get('/finance/payouts');
    return response.data;
  },

  // Demander un retrait vers Mobile Money
  requestPayout: async (payoutData) => {
    const response = await API.post('/finance/payouts', payoutData);
    return response.data;
  }
};