import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Logger } from '@lib/logger';

let io: SocketServer | null = null;

export let initSocket = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    Logger.info(`Socket connected: ${socket.id}`);

    socket.on('join-table', (tableId: string) => {
      socket.join(`table:${tableId}`);
      Logger.info(`Socket ${socket.id} joined table:${tableId}`);
    });

    socket.on('join-kitchen', () => {
      socket.join('kitchen');
      Logger.info(`Socket ${socket.id} joined kitchen`);
    });

    socket.on('disconnect', () => {
      Logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export let getIo = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
