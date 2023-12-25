import { EntityManager } from 'typeorm';
import { VisitDTO } from '../../interfaces/visit.interface';
import { VisitRepository } from './repository';
import { UserRepository } from '../user/repository';
import { TypeVisitRepository } from '../type-visit/repository';
import { VisitStatusRepository } from '../visit-status/repository';
import { VisitVisitorRepository } from '../visit-visitor/repository';
import { ServiceException } from '../../shared/service-exception';
import {
  ERR_401,
  NO_EXIST_RECORD,
  RECORD_CREATED_FAIL,
  VALID_LIST_VISITORS,
} from '../../shared/messages';
import {
  TypeVisitEntity,
  VisitEntity,
  VisitStatusEntity,
  VisitVisitorEntity,
} from '../../database';
import { VisitStatusEnum } from '../../enums/visit.enum';
import { VisitorRepository } from '../visitor/repository';
import { PaginationI } from '../../interfaces/global.interface';

export class VisitService {

  constructor(
    private readonly _repo = new VisitRepository(),
    private readonly _repoUser = new UserRepository(),
    private readonly _repoVisitStatus = new VisitStatusRepository(),
    private readonly _repoTypeVisit = new TypeVisitRepository(),
    private readonly _repoVisitor = new VisitorRepository(),
    private readonly _repoVisitVisitor = new VisitVisitorRepository(),
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

  async getById(cnx: EntityManager, id: number) {
    const visit = await this._repo.getById(cnx, id);

    if (!visit) {
      throw new ServiceException(NO_EXIST_RECORD('la visita'));
    }

    return visit;
  }

  async create(cnx: EntityManager, payload: VisitDTO) {
    return cnx.transaction(async (cnxTran) => {
      if (!global.user) {
        throw new ServiceException(ERR_401);
      }

      const { startDate, validityHours, listVisitors, type } = payload;

      if (!listVisitors.length) {
        throw new ServiceException(VALID_LIST_VISITORS);
      }

      const userId = global.user.id;
      const residency = await this._repoUser.getMainResidency(cnxTran, userId);

      if (!residency) {
        throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
      }

      const existsStatus = await this._repoVisitStatus.getByName(
        cnxTran,
        VisitStatusEnum.PENDING
      );

      const existsType = await this._repoTypeVisit.getByName(cnxTran, type);

      const statusData = { name: VisitStatusEnum.PENDING } as VisitStatusEntity;
      const typeVisitData = { name: type } as TypeVisitEntity;

      const typeVisit = existsType ?? (
        await this._repoTypeVisit.create(cnxTran, typeVisitData)
      );

      const statusVisit = existsStatus ?? (
        await this._repoVisitStatus.create(cnxTran, statusData)
      );

      const visitData = {
        startDate,
        validityHours,
        typeVisitId: typeVisit.id,
        residencyId: residency.id,
        statusId: statusVisit.id,
      } as VisitEntity;

      const visitCreated = await this._repo.create(cnxTran, visitData);

      if (!visitCreated) {
        throw new ServiceException(RECORD_CREATED_FAIL('la visita'));
      }

      for (const visitorId of listVisitors) {
        const visitor = await this._repoVisitor.getValidVisitor(
          cnxTran,
          visitorId,
          residency.id
        );

        if (!visitor) {
          throw new ServiceException(NO_EXIST_RECORD('visitante'));
        }
      }

      const visitVisitorData = listVisitors.map((id) =>({
        visitId: visitCreated.id,
        visitorId: id,
      } as VisitVisitorEntity));

      const visitVisitorCreated = await this._repoVisitVisitor.create(
        cnxTran,
        visitVisitorData
      );

      if (!visitVisitorCreated.length) {
        throw new ServiceException(RECORD_CREATED_FAIL('la visita'));
      }

      return visitCreated;
    });
  }
}
