import API from './api';

export const smsService = {
  // Récupérer le solde actuel et les forfaits SMS disponibles
  getSmsStoreInfo: async () => {
    const response = await API.get('/sms/store');
    return response.data;
  },

  // Acheter un pack de SMS via Mobile Money
  buySmsPack: async (purchaseData) => {
    const response = await API.post('/sms/buy', purchaseData);
    return response.data;
  }
};