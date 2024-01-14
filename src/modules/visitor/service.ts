import { EntityManager } from 'typeorm';
import { VisitorEntity } from '../../database';
import { VisitorRepository } from './repository';
import { UserRepository } from '../user/repository';
import { PaginationI } from '../../interfaces/global.interface';
import { VisitorDTO, VisitorUpdateDTO } from '../../interfaces/visitor.interface';
import { ServiceException } from '../../shared/service-exception';
import {
  ERR_401,
  EXISTS_RECORD,
  NO_EXIST_RECORD,
  RECORD_CREATED_FAIL,
  RECORD_EDIT,
  RECORD_EDIT_FAIL,
  VISITOR_DISABLE,
} from '../../shared/messages';

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
    const mainResidency = await this._repoUser.getMainResidency(cnx, userId);

    if (!mainResidency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
    }

    const data = await this._repo.getAll(cnx, payload, mainResidency.id);
    return data;
  }

  async getOne(cnx: EntityManager, id: number) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const userId = global.user.id;
    const mainResidency = await this._repoUser.getMainResidency(cnx, userId);

    if (!mainResidency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
    }

    const visitor = await this._repo.getValidVisitor(cnx, id, mainResidency.id);

    if (!visitor) {
      throw new ServiceException(NO_EXIST_RECORD('visitante'));
    }

    return visitor;
  }

  async create(cnx: EntityManager, payload: VisitorDTO) {
    return cnx.transaction(async (cnxTran) => {
      if (!global.user) {
        throw new ServiceException(ERR_401);
      }

      const { names, surnames, docNumber, phone } = payload;

      const userId = global.user.id;
      const mainResidency = await this._repoUser.getMainResidency(cnxTran, userId);

      if (!mainResidency) {
        throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
      }

      const existsVisitor = await this._repo.getByDocNumber(cnxTran, docNumber);

      if (existsVisitor) {
        throw new ServiceException(EXISTS_RECORD('visitante'));
      }

      const visitorData = {
        names,
        surnames,
        docNumber,
        phone,
        residencyId: mainResidency.id,
      } as VisitorEntity;

      const visitorCreated = await this._repo.create(cnxTran, visitorData);

      if (!visitorCreated) {
        throw new ServiceException(RECORD_CREATED_FAIL('visitante'));
      }

      return visitorCreated;
    });
  }

  async update(cnx: EntityManager, id: number, payload: VisitorUpdateDTO) {
    return cnx.transaction(async (cnxTran) => {
      if (!global.user) {
        throw new ServiceException(ERR_401);
      }

      const userId = global.user.id;
      const mainResidency = await this._repoUser.getMainResidency(cnxTran, userId);

      if (!mainResidency) {
        throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
      }

      const { names, surnames, phone } = payload;

      const visitor = await this._repo.getValidVisitor(cnxTran, id, mainResidency.id);

      if (!visitor) {
        throw new ServiceException(NO_EXIST_RECORD('visitante'));
      }

      const visitorData = {
        names,
        surnames,
        phone,
      } as VisitorEntity;

      const visitorUpdated = await this._repo.update(cnxTran, id, visitorData);

      if (!visitorUpdated) {
        throw new ServiceException(RECORD_EDIT_FAIL('visitante'));
      }

      return RECORD_EDIT('Visitante');
    });
  }

  async disable(cnx: EntityManager, id: number) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const userId = global.user.id;
    const mainResidency = await this._repoUser.getMainResidency(cnx, userId);

    if (!mainResidency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
    }

    const visitor = await this._repo.getValidVisitor(cnx, id, mainResidency.id);

    if (!visitor) {
      throw new ServiceException(NO_EXIST_RECORD('visitante'));
    }

    if (!visitor.status) {
      throw new ServiceException(VISITOR_DISABLE);
    }

    const visitorData = { status: false } as VisitorEntity;

    const visitorUpdated = await this._repo.update(cnx, id, visitorData);

    if (!visitorUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL('visitante'));
    }

    return RECORD_EDIT('Visitante');
  }
}
