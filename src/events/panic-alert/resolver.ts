import { Socket } from 'socket.io';
import { EventsEnum } from '../../enums/events.enum';

export class PanicAlertResolver {

  public handleAlert(socket: Socket, data: unknown): void {
    console.info('Panic Alert:', data);

    socket.broadcast.emit(EventsEnum.NOTIFY_PANIC_ALERT, data);
  }

}
