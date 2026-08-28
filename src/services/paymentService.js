import API from './api';

export const createPayment = async (payment) => {
	const response = await API.post('/payments/initiate', {
		plan_id: payment.plan_id || payment.planId,
		phone: payment.phone,
		email: payment.email,
	});
	return response.data;
};

export const getPaymentStatus = async (reference) => {
	const response = await API.get(`/payments/status/${reference}`);
	return response.data;
};