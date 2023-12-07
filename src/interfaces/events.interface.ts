import { Server, Socket } from 'socket.io';

export interface SocketEventI {
  init(ioServer: Server, socket: Socket): void;
}
