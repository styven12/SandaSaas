import API from './api';

export const logService = {
  // Récupérer la liste des logs avec filtres & pagination
  getLegalLogs: async (params = {}) => {
    const response = await API.get('/logs/legal', { params });
    return response.data;
  },

  // Exporter les logs enregistrés en CSV
  exportLogsCsv: async (params = {}) => {
    const response = await API.get('/logs/legal/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  }
};