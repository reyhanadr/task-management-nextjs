import { create } from 'zustand';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  user_id: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  userId: string | null;
  isHydrated: boolean;
  setToken: (token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  isHydrated: false,
  setToken: (token) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      localStorage.setItem('token', token);
      set({ 
        token,
        userId: decoded.user_id,
        isHydrated: true 
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      set({ 
        token: null, 
        userId: null,
        isHydrated: true 
      });
    }
  },
  clear: () => {
    localStorage.removeItem('token');
    set({ 
      token: null, 
      userId: null,
      isHydrated: true 
    });
  },
}));

export const useHydrateAuthFromStorage = ({ onHydrated }: { onHydrated?: () => void } = {}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        useAuthStore.setState({ 
          token, 
          userId: decoded.user_id,
          isHydrated: true 
        });
      } catch (error) {
        console.error('Error decoding stored token:', error);
        localStorage.removeItem('token');
        useAuthStore.setState({ 
          token: null, 
          userId: null,
          isHydrated: true 
        });
      }
    } else {
      useAuthStore.setState({ 
        token: null, 
        userId: null,
        isHydrated: true 
      });
    }
    
    if (onHydrated) {
      onHydrated();
    }
  }, [onHydrated]);

  return useAuthStore((s) => s.isHydrated);
};