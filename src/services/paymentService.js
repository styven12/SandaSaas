import { apiRequest } from './api'
export const createPayment = (payment) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(payment) })
export const getPaymentStatus = (id) => apiRequest(`/payments/${id}`)