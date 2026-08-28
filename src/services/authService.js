import API from './api';

export const authService = {
  // Inscription d'un nouveau gérant
  register: async (data) => {
    const response = await API.post('/auth/register', data);
    return response.data;
  },

  // Connexion d'un gérant
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tenant', JSON.stringify(response.data.tenant));
    }
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenant');
    window.location.href = '/login';
  },

  // Récupérer le gérant stocké localement
  getCurrentTenant: () => {
    const tenant = localStorage.getItem('tenant');
    return tenant ? JSON.parse(tenant) : null;
  }
};