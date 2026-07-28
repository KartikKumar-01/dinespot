import { useState, useCallback } from 'react';
import * as bookingApi from '../api/bookingApi';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const booking = await bookingApi.createBooking(data);
      return { success: true, booking };
    } catch (err) {
      const message = err.response?.data?.message || 'Booking failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id) => {
    try {
      await bookingApi.cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Cancel failed' };
    }
  }, []);

  return { bookings, loading, error, fetchMyBookings, createBooking, cancelBooking };
}
