import api from './axios';

export const getOwnerRestaurant = async () => {
  const res = await api.get('/owner/restaurant');
  return res.data;
};

// FormData for image upload — do NOT set Content-Type (browser auto-sets multipart boundary)
export const createOwnerRestaurant = async (formData) => {
  const res = await api.post('/owner/restaurant', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateOwnerRestaurant = async (formData) => {
  const res = await api.put('/owner/restaurant', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getOwnerBookings = async () => {
  const res = await api.get('/owner/bookings');
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await api.put(`/owner/bookings/${id}/status`, { status });
  return res.data;
};
