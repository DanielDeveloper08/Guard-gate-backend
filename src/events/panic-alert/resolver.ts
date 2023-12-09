import { Socket } from 'socket.io';
import { EventsEnum } from '../../enums/events.enum';
import { UserRepository } from '../../modules/user/repository';
import { AppDataSource } from '../../database';

export class PanicAlertResolver {

  constructor(
    private readonly _repo = new UserRepository(),
    private readonly _cnx = AppDataSource.getInstance().cnx,
  ) {}

  public async handleAlert(socket: Socket, userId?: number) {
    if (!userId) return;

    const userInfo = await this._repo.getResidencesByUserId(
      this._cnx,
      userId,
      true
    );

    if (!userInfo) return;

    socket.broadcast.emit(EventsEnum.NOTIFY_PANIC_ALERT, userInfo);
  }
}
