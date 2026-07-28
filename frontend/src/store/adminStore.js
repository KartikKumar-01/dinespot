import { create } from 'zustand';
import * as adminApi from '../api/adminApi';

const useAdminStore = create((set) => ({
  stats: null,
  restaurants: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await adminApi.getAdminStats();
      set({ stats: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load stats', loading: false });
    }
  },

  fetchAllRestaurants: async () => {
    set({ loading: true, error: null });
    try {
      const data = await adminApi.getAllRestaurants();
      set({ restaurants: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load restaurants', loading: false });
    }
  },

  approveRestaurant: async (id, status) => {
    try {
      const updated = await adminApi.approveRestaurant(id, status);
      set((state) => ({
        restaurants: state.restaurants.map((r) =>
          r._id === id ? { ...r, status: updated.status } : r
        ),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Action failed' };
    }
  },
}));

export default useAdminStore;
