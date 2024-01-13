import { EntityManager } from 'typeorm';
import { HomeRepository } from './repository';
import { UserRepository } from '../user/repository';
import { ERR_401, NO_EXIST_RECORD } from '../../shared/messages';
import { ServiceException } from '../../shared/service-exception';
import { VisitDataI, VisitDataPayloadI } from '../../interfaces/home.interface';

export class HomeService {

  constructor(
    private readonly _repo = new HomeRepository(),
    private readonly _repoUser = new UserRepository(),
  ) {}

  async getVisitData(
    cnx: EntityManager,
    payload: VisitDataPayloadI
  ): Promise<VisitDataI> {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const userId = global.user.id;
    const mainResidency = await this._repoUser.getMainResidency(cnx, userId);

    if (!mainResidency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
    }

    const { limit, frequency } = payload;

    const lastVisits = await this._repo.getLastVisits(
      cnx,
      mainResidency.id,
      limit
    );

    const pendingVisits = await this._repo.getLastVisits(
      cnx,
      mainResidency.id,
      limit,
      true
    );

    const visitors = await this._repo.getFrequentVisitors(
      cnx,
      mainResidency.id,
      limit
    );

    const frequentVisitors = visitors.filter(
      (visit) => visit.frequency >= Number(frequency ?? 5)
    );

    const data: VisitDataI = {
      lastVisits,
      pendingVisits,
      frequentVisitors,
    };

    return data;
  }
}
