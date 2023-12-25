import { EntityManager } from 'typeorm';
import { VisitorEntity } from '../../database';
import { VisitorRepository } from './repository';
import { PaginationI } from '../../interfaces/global.interface';
import { VisitorDTO } from '../../interfaces/visitor.interface';
import { ServiceException } from '../../shared/service-exception';
import {
  ERR_401,
  NO_EXIST_RECORD,
  RECORD_CREATED_FAIL,
} from '../../shared/messages';
import { UserRepository } from '../user/repository';

export class VisitorService {

  constructor(
    private readonly _repo = new VisitorRepository(),
    private readonly _repoUser = new UserRepository(),
  ) {}

  async getAll(cnx: EntityManager, payload: PaginationI) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const userId = global.user.id;
    const residency = await this._repoUser.getMainResidency(cnx, userId);

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
    }

    const data = await this._repo.getAll(cnx, payload, residency.id);
    return data;
  }

  async create(cnx: EntityManager, payload: VisitorDTO) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const { names, surnames, docNumber } = payload;

    const userId = global.user.id;
    const residency = await this._repoUser.getMainResidency(cnx, userId);

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
    }

    const visitorData = {
      names,
      surnames,
      docNumber,
      residencyId: residency.id,
    } as VisitorEntity;

    const visitorCreated = await this._repo.create(cnx, visitorData);

    if (!visitorCreated) {
      throw new ServiceException(RECORD_CREATED_FAIL('el contacto'));
    }

    return visitorCreated;
  }
}
