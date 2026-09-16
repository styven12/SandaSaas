import API from './api';

const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

export const adminService = {
  login: async ({ email, password, rememberMe = true }) => {
    const response = await API.post('/admin/auth/login', { email, password });
    const storage = rememberMe ? localStorage : sessionStorage;
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    storage.setItem('adminToken', response.data.token);
    storage.setItem('admin', JSON.stringify(response.data.admin));
    return response.data;
  },
  getOverview: async () => (await API.get('/admin/overview', { headers: { Authorization: `Bearer ${getToken()}` } })).data,
  createPayout: async (data) => (await API.post('/admin/payouts', data, { headers: { Authorization: `Bearer ${getToken()}` } })).data,
  updatePayout: async (id, status) => (await API.patch(`/admin/payouts/${id}`, { status }, { headers: { Authorization: `Bearer ${getToken()}` } })).data,
  updateCredentials: async (data) => (await API.put('/admin/credentials', data, { headers: { Authorization: `Bearer ${getToken()}` } })).data,
  getActivities: async () => (await API.get('/admin/activities', { headers: { Authorization: `Bearer ${getToken()}` } })).data,
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('admin');
    window.location.href = '/admin/login';
  }
};
