import API from './api';

export const dashboardService = {
  // Récupère les métriques clés et l'historique
  getStats: async () => {
    const response = await API.get('/dashboard/stats');
    return response.data;
  }
};