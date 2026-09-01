import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://broadwaresaas.onrender.com/api';
const normalizedBaseUrl = configuredBaseUrl.replace(/\/+$/, '');
const baseURL = normalizedBaseUrl.endsWith('/api') ? normalizedBaseUrl : `${normalizedBaseUrl}/api`;

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter le token JWT dans chaque requête gérant
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Gérer le Content-Type pour les fichiers
    if (config.data instanceof FormData) {
      // Supprimer le Content-Type pour que axios/navigateur gère multipart/form-data
      delete config.headers['Content-Type'];
    } else if (!config.data || typeof config.data === 'object') {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer l'expiration du Token (Redirection vers Login si 401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('tenant');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('tenant');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;