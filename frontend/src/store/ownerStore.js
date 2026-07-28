import { create } from 'zustand';
import * as ownerApi from '../api/ownerApi';

const useOwnerStore = create((set) => ({
  restaurant: null,
  bookings: [],
  loading: false,
  error: null,

  fetchRestaurant: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ownerApi.getOwnerRestaurant();
      set({ restaurant: data, loading: false });
    } catch (err) {
      // 400 with "No restaurant found" means first-time owner
      const msg = err.response?.data?.message || '';
      set({ restaurant: null, loading: false, error: msg === 'No restaurant found' ? null : msg });
    }
  },

  createRestaurant: async (formData) => {
    set({ loading: true, error: null });
    try {
      const data = await ownerApi.createOwnerRestaurant(formData);
      set({ restaurant: data, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create restaurant';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  updateRestaurant: async (formData) => {
    set({ loading: true, error: null });
    try {
      const data = await ownerApi.updateOwnerRestaurant(formData);
      set({ restaurant: data, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update restaurant';
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ownerApi.getOwnerBookings();
      set({ bookings: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load bookings', loading: false });
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      await ownerApi.updateBookingStatus(id, status);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === id ? { ...b, status } : b
        ),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  },
}));

export default useOwnerStore;
