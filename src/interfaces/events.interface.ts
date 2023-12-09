import { Socket } from 'socket.io';

export interface SocketEventI {
  init(socket: Socket): void;
}
