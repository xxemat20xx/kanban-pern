import { create } from 'zustand';
import api from '../api/axiosInstance';
import useBoardStore from './boardStore';

const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/login', { email, password });
            set({ user: res.data, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    },
    register: async (email, password) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/register', { email, password });
            set({ user: res.data, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    },
    logout: async () => {
        await api.post('/auth/logout');
        set({ user: null });
        useBoardStore.getState().reset();
    },
    checkUser: async () => {
        try {
            const res = await api.get('/auth/me');
            set({ user: res.data });
        } catch {
            set({ user: null });
        }
    }
}));
export default useAuthStore;