import { create } from 'zustand';
import { authService } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/user';
import { persist } from 'zustand/middleware';
import { userService } from '@/services/users';

interface AuthStore {
  userId: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userId: null,
      user: null,
      isAuthenticated: false,

      fetchUserData: async () => {
        const userId = get().userId;
        if (!userId) return;
        
        try {
          const userData = await userService.getById(userId);
          set({ user: userData });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      },

      initializeAuth: async () => {
        if (typeof window === 'undefined') return; // Skip during SSR
        
        const token = localStorage.getItem('token');
        if (!token) {
          set({ userId: null, user: null, isAuthenticated: false });
          return;
        }

        try {
          const decoded = jwtDecode(token) as { sub: string };
          const currentUserId = get().userId;
          
          if (currentUserId !== decoded.sub) {
            set({ userId: decoded.sub, isAuthenticated: true });
            await get().fetchUserData();
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          set({ userId: null, user: null, isAuthenticated: false });
        }
      },  login: async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const token = response.access_token;
      const decoded = jwtDecode(token) as { sub: string; email: string; name: string, createdAt: string };
      
      set({
        isAuthenticated: true,
        user: {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          createdAt: decoded.createdAt, 
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

      register: async (email: string, password: string, name: string) => {
        try {
          const response = await authService.register(email, password, name);
          const token = response.access_token;
          const decoded = jwtDecode(token) as { sub: string };
          
          set({ userId: decoded.sub, isAuthenticated: true });
          await get().fetchUserData();
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}),
{
  name: 'auth-storage',
  skipHydration: true, 
}
));
