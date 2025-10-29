// lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket || socket.disconnected) {
    const token = localStorage.getItem('token');
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => console.log('WS Connected'));
    socket.on('disconnect', () => console.log('WS Disconnected'));
    socket.on('connect_error', (err) => console.error('WSWS Error:', err));
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};