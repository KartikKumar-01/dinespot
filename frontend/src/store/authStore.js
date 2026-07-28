import { create } from 'zustand';
import * as authApi from '../api/authApi';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  // Start loading:true when a token exists so ProtectedRoute waits
  // for getMe() to finish before deciding to redirect on page refresh
  loading: !!localStorage.getItem('token'),

  login: async (credentials) => {
    set({ loading: true });
    try {
      const data = await authApi.loginUser(credentials);
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  register: async (userData) => {
    set({ loading: true });
    try {
      const data = await authApi.registerUser(userData);
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ loading: true });
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },
}));

export default useAuthStore;
