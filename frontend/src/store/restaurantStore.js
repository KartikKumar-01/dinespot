import { create } from 'zustand';
import * as restaurantApi from '../api/restaurantApi';

const useRestaurantStore = create((set) => ({
  restaurants: [],
  featuredRestaurants: [],
  loading: false,
  error: null,

  getRestaurants: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await restaurantApi.getRestaurants(params);
      set({ restaurants: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load restaurants', loading: false });
    }
  },

  getFeaturedRestaurants: async () => {
    set({ loading: true, error: null });
    try {
      const data = await restaurantApi.getFeaturedRestaurants();
      set({ featuredRestaurants: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load featured restaurants', loading: false });
    }
  },
}));

export default useRestaurantStore;
