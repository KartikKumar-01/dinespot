import api from './axios';

export const createBooking = async (data) => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await api.get('/bookings/my');
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await api.put(`/bookings/${id}/cancel`);
  return res.data;
};
