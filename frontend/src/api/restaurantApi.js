import api from './axios';

export const getRestaurants = async (params = {}) => {
  const res = await api.get('/restaurant', { params });
  return res.data;
};

export const getFeaturedRestaurants = async () => {
  const res = await api.get('/restaurant/featured');
  return res.data;
};

export const getRestaurantBySlug = async (slug) => {
  const res = await api.get(`/restaurant/${slug}`);
  return res.data;
};

export const getRestaurantAvailability = async (id, date) => {
  const res = await api.get(`/restaurant/${id}/availability`, { params: { date } });
  return res.data;
};
