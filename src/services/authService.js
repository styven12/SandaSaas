import API from './api';

const getStorage = (rememberMe) => (rememberMe ? localStorage : sessionStorage);

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tenant');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('tenant');
};

export const authService = {
  // Inscription d'un nouveau gérant
  register: async (data) => {
    const response = await API.post('/auth/register', {
      ...data,
      phone_payout: data.phone_payout || data.phone,
    });
    return response.data;
  },

  // Connexion d'un gérant
  login: async (credentials) => {
    const rememberMe = Boolean(credentials?.rememberMe);
    const storage = getStorage(rememberMe);

    const response = await API.post('/auth/login', {
      ...credentials,
      rememberMe,
    });

    if (response.data.token) {
      clearAuthStorage();
      storage.setItem('token', response.data.token);
      storage.setItem('tenant', JSON.stringify(response.data.tenant));
    }
    return response.data;
  },

  // Déconnexion
  logout: () => {
    clearAuthStorage();
    window.location.href = '/login';
  },

  // Récupérer le gérant stocké localement
  getCurrentTenant: () => {
    const tenant = localStorage.getItem('tenant') || sessionStorage.getItem('tenant');
    return tenant ? JSON.parse(tenant) : null;
  },

  getStoredToken: () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
};