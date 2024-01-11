import { CommandStartedEvent, EntityManager } from 'typeorm';
import { HomeRepository } from './repository';
import { UserRepository } from '../user/repository';
import { ERR_401, NO_EXIST_RECORD } from '../../shared/messages';
import { ServiceException } from '../../shared/service-exception';
import { VisitDataI } from '../../interfaces/home.interface';

export class HomeService {

  constructor(
    private readonly _repo = new HomeRepository(),
    private readonly _repoUser = new UserRepository()
  ) {}

  async getVisitData(cnx: EntityManager): Promise<VisitDataI> {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const userId = global.user.id;
    const mainResidency = await this._repoUser.getMainResidency(cnx, userId);

    if (!mainResidency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
    }

    const lastVisits = await this._repo.getLastVisits(cnx, mainResidency.id, 3);

    const data: VisitDataI = {
      lastVisits,
    };

    return data;
  }
}
