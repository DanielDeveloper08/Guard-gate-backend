import { Server, Socket } from 'socket.io';
import { SocketEventI } from '../../interfaces/events.interface';
import { PanicAlertResolver } from './panic-alert.resolver';

export class PanicAlertEvent implements SocketEventI {

  constructor(
    private readonly _resolver = new PanicAlertResolver(),
  ) {}

  init(ioServer: Server, socket: Socket): void {
    throw new Error('Method not implemented.');
  }
}
