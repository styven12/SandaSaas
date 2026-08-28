import API from './api';

export const financeService = {
  // Récupérer le solde et les statistiques financières
  getBalance: async () => {
    const response = await API.get('/finance/balance');
    return {
      ...response.data,
      available: response.data.available ?? response.data.available_balance ?? 0,
      pending: response.data.pending ?? response.data.pending_withdrawn ?? 0,
    };
  },

  // Récupérer l'historique des retraits
  getPayouts: async () => {
    const response = await API.get('/finance/payouts');
    return response.data;
  },

  // Demander un retrait vers Mobile Money
  requestPayout: async (payoutData) => {
    const response = await API.post('/finance/withdraw', {
      amount: payoutData.amount,
      phone_number: payoutData.phone_number || payoutData.phone,
      payment_method: payoutData.payment_method || payoutData.provider,
    });
    return response.data;
  }
};