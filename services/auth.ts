import api from '@/lib/api';
import type { User } from '@/components/auth/auth';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.access_token;
    localStorage.setItem('token', token);
    return res.data;
  },

  register: async (email: string, password: string, name: string) => {
    const res = await api.post('/auth/register', { email, password, name });
    const token = res.data.access_token;
    localStorage.setItem('token', token);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};