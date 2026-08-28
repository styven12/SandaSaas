import API from './api';

export const portalService = {
  // Récupère les infos de la zone et ses forfaits publics via son slug
  getPortalInfo: async (slug) => {
    const response = await API.get(`/portal/${slug}`);
    return response.data;
  },

  // Demande l'envoi d'un code OTP par SMS
  requestOtp: async (phone, zoneId) => {
    const response = await API.post('/otp/request-otp', { phone, zone_id: zoneId });
    return response.data;
  },

  // Initier le paiement Mobile Money
  initiatePayment: async (paymentData) => {
    const response = await API.post('/payments/initiate', {
      plan_id: paymentData.plan_id || paymentData.planId,
      phone: paymentData.phone,
      email: paymentData.email,
    });
    return response.data;
  },

  // Vérifier le statut de la transaction (Polling)
  checkPaymentStatus: async (transactionId) => {
    const response = await API.get(`/payments/status/${transactionId}`);
    return response.data;
  }
};