import API from './api';

export const smsService = {
  // Récupérer le solde actuel et les forfaits SMS disponibles
  getSmsStoreInfo: async () => {
    const response = await API.get('/sms/packs');
    return {
      ...response.data,
      balance: response.data.balance ?? response.data.sms_balance ?? 0,
    };
  },

  // Acheter un pack de SMS via Mobile Money
  buySmsPack: async (purchaseData) => {
    const packKey = purchaseData.pack_key || purchaseData.packId || purchaseData.id || purchaseData.key;

    const response = await API.post('/sms/buy-pack', {
      pack_key: packKey,
      packId: packKey,
      phone: purchaseData.phone,
      provider: purchaseData.provider,
    });
    return response.data;
  }
};