import { Socket } from 'socket.io';
import { SocketEventI } from '../../interfaces/events.interface';
import { PanicAlertResolver } from './resolver';
import { EventsEnum } from '../../enums/events.enum';

export class PanicAlertEvent implements SocketEventI {

  constructor(
    private readonly _resolver = new PanicAlertResolver(),
  ) {}

  init(socket: Socket): void {
    socket.on(
      EventsEnum.NOTIFY_PANIC_ALERT,
      this._resolver.handleAlert.bind(null, socket)
    );
  }

}
