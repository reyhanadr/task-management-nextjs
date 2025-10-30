import api from '@/lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.access_token;
    localStorage.setItem('token', token);
    // Set token in cookie
    document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 days
    return res.data;
  },

  register: async (email: string, password: string, name: string) => {
    const res = await api.post('/auth/register', { email, password, name });
    const token = res.data.access_token;
    localStorage.setItem('token', token);
    // Set token in cookie
    document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 days
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    // Remove token from cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
};