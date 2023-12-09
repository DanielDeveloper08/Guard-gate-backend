import { Socket } from 'socket.io';
import { PanicAlertResolver } from './resolver';
import { EventsEnum } from '../../enums/events.enum';
import { SocketEventI } from '../../interfaces/events.interface';

export class PanicAlertEvent implements SocketEventI {

  constructor(
    private readonly _resolver = new PanicAlertResolver(),
  ) {}

  init(socket: Socket): void {
    socket.on(
      EventsEnum.NOTIFY_PANIC_ALERT,
      this._resolver.handleAlert.bind(this._resolver, socket)
    );
  }

}
