import { useEffect } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/hooks/useAuthStore';

export const useSocket = () => {
  const { isAuthenticated } = useAuthStore();

  const connect = () => {
    if (isAuthenticated) {
      getSocket();
      console.log('WS Connected');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
      console.log('WS Disconnected'); 
    };
  }, [isAuthenticated]);

  return { connect };
};