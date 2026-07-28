import api from './axios';

// NOTE: Backend uses PUT (not GET) for stats endpoint
export const getAdminStats = async () => {
  const res = await api.put('/admin/stats');
  return res.data;
};

export const getAllRestaurants = async () => {
  const res = await api.get('/admin/restaurants');
  return res.data;
};

export const approveRestaurant = async (id, status) => {
  const res = await api.put(`/admin/restaurants/${id}/approve`, { status });
  return res.data;
};
