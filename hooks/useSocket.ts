import { useEffect } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/hooks/useAuthStore';

export const useSocket = () => {
  const { token } = useAuthStore();

  const connect = () => {
    if (token) {
      const socket = getSocket();
      // Auto-reconnect logic sudah di socket.io
    }
  };

  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return { connect };
};