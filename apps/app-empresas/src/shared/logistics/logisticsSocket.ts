import { io, Socket } from 'socket.io-client';
import { ENV } from '@/shared/config/env.config';

let socket: Socket | null = null;

export const connectLogisticsSocket = (restauranteId: number): Socket => {
  if (socket?.connected) return socket;

  socket = io(ENV.LOGISTICS_WS_URL, {
    auth: {
      token: String(restauranteId),
      type: 'restaurante',
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Logistics WS] Conectado, suscribiendo al feed...');
    socket?.emit('restaurante:subscribe', restauranteId);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Logistics WS] Desconectado:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('[Logistics WS] Error de conexión:', err.message);
  });

  return socket;
};

export const disconnectLogisticsSocket = (restauranteId: number): void => {
  if (socket?.connected) {
    socket.emit('restaurante:unsubscribe', restauranteId);
    socket.disconnect();
  }
  socket = null;
};

export const getLogisticsSocket = (): Socket | null => socket;
