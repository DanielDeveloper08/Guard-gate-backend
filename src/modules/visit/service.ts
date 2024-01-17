import { EntityManager } from 'typeorm';
import {
  NotificationPayloadI,
  SaveVisitDetailI,
  VisitDTO,
  VisitPayloadI,
} from '../../interfaces/visit.interface';
import { VisitRepository } from './repository';
import { UserRepository } from '../user/repository';
import { VisitVisitorRepository } from '../visit-visitor/repository';
import { ServiceException } from '../../shared/service-exception';
import {
  ERR_401,
  NO_EXIST_RECORD,
  QR_MESSAGE_FAIL,
  QR_MESSAGE_SUCCESS,
  REASON_VISIT,
  RECORD_CREATED_FAIL,
  RECORD_EDIT,
  RECORD_EDIT_FAIL,
  VALID_LIST_VISITORS,
  VISITOR_HAS_ENTERED,
  VISIT_OUT_RANGE,
  VISITS_SYNC_STATUS_SUCCESS,
} from '../../shared/messages';
import {
  VisitEntity,
  VisitVisitorEntity,
} from '../../database';
import { VisitStatusEnum, VisitTypeEnum } from '../../enums/visit.enum';
import { VisitorRepository } from '../visitor/repository';
import { IDateFilter } from '../../interfaces/global.interface';
import { DateFormatHelper, WsHelper } from '../../helpers';
import { SendMessageI } from '../../interfaces/ws.interface';

export class VisitService {

  constructor(
    private readonly _repo = new VisitRepository(),
    private readonly _repoUser = new UserRepository(),
    private readonly _repoVisitor = new VisitorRepository(),
    private readonly _repoVisitVisitor = new VisitVisitorRepository(),
    private readonly _wsHelper = new WsHelper(),
    private readonly _dateFormat = new DateFormatHelper(),
  ) {}

  async getAll(cnx: EntityManager, payload: VisitPayloadI) {
    const { residencyId } = payload;

    if (residencyId?.trim()) {
      const data = await this._repo.getAll(cnx, payload, Number(residencyId));
      return data;
    }

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

  async getStatusSummary(cnx: EntityManager, payload: IDateFilter) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const data = await this._repo.getStatusSummary(cnx, payload);
    return data;
  }

  async getDateSummary(cnx: EntityManager, payload: IDateFilter) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }
    
    const data = await this._repo.getDateSummary(cnx, payload);
    return data.map((datum)=>({
      date:datum.date.toISOString().slice(0,10),
      count:datum.count
    }));
  }

  async getById(cnx: EntityManager, id: number) {
    const visit = await this._repo.getById(cnx, id);

    if (!visit) {
      throw new ServiceException(NO_EXIST_RECORD('la visita'));
    }

    if (visit.type !== VisitTypeEnum.QR) return visit;

    const diff = this._dateFormat.getDiffInHours(visit.startDate);

    if (diff > visit.validityHours || diff < visit.validityHours) {
      return {
        ...visit,
        message: VISIT_OUT_RANGE,
      };
    }

    return visit;
  }

  async create(cnx: EntityManager, payload: VisitDTO) {
    return cnx.transaction(async (cnxTran) => {
      if (!global.user) {
        throw new ServiceException(ERR_401);
      }

      const { startDate, validityHours, listVisitors, reason, type } = payload;

      if (!listVisitors.length) {
        throw new ServiceException(VALID_LIST_VISITORS);
      }

      const userId = global.user.id;
      const mainResidency = await this._repoUser.getMainResidency(cnxTran, userId);

      if (!mainResidency) {
        throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
      }

      const endDate = this._dateFormat.addHours(startDate, validityHours);

      const visitData = {
        startDate,
        endDate,
        validityHours,
        type,
        reason: reason ?? REASON_VISIT(mainResidency.urbanization),
        residencyId: mainResidency.id,
      } as VisitEntity;

      const visitCreated = await this._repo.create(cnxTran, visitData);

      if (!visitCreated) {
        throw new ServiceException(RECORD_CREATED_FAIL('la visita'));
      }

      for (const visitorId of listVisitors) {
        const visitor = await this._repoVisitor.getValidVisitor(
          cnxTran,
          visitorId,
          mainResidency.id
        );

        if (!visitor) {
          throw new ServiceException(NO_EXIST_RECORD('visitante'));
        }
      }

      const visitVisitorData = listVisitors.map((id) =>({
        visitId: visitCreated.id,
        visitorId: id,
      } as VisitVisitorEntity));

      const visitVisitorCreated = await this._repoVisitVisitor.createMany(
        cnxTran,
        visitVisitorData
      );

      if (!visitVisitorCreated.length) {
        throw new ServiceException(RECORD_CREATED_FAIL('la visita'));
      }

      return visitCreated;
    });
  }

  async saveDetail(cnx: EntityManager, payload: SaveVisitDetailI) {
    return cnx.transaction(async (cnxTran) => {
      const { visitId, visitorId, observation, carPlate, hasEntered, photos } = payload;

      const visitor = await this._repoVisitVisitor.getVisitVisitor(
        cnxTran,
        visitId,
        visitorId
      );

      if (!visitor) {
        throw new ServiceException(NO_EXIST_RECORD('visitante'));
      }

      if (visitor.hasEntered || visitor.entryDate !== null) {
        throw new ServiceException(VISITOR_HAS_ENTERED);
      }

      const visitVisitorData = {
        hasEntered,
        entryDate: new Date(),
        observation: observation ?? null,
        carPlate: carPlate ?? null,
        photos: photos.length ? JSON.stringify(photos) : null,
      } as VisitVisitorEntity;

      const visitVisitorUpdated = await this._repoVisitVisitor.update(
        cnxTran,
        visitor.id,
        visitVisitorData
      );

      if (!visitVisitorUpdated) {
        throw new ServiceException(RECORD_EDIT_FAIL('visitante'));
      }

      return RECORD_EDIT('Detalle del visitante');
    });
  }

  async sendNotification(cnx: EntityManager, payload: NotificationPayloadI) {
    return cnx.transaction(async (cnxTran) => {
      const { visitId, imgUrl } = payload;

      const visit = await this._repo.getById(cnxTran, visitId);

      if (!visit) {
        throw new ServiceException(NO_EXIST_RECORD('la visita'));
      }

      const visitors = visit.visitors.filter(visitor => visitor.phone);

      if (!visitors.length) return null;

      const messagePayload = {
        imgUrl,
        residentName: visit.generatedBy,
      } as SendMessageI;

      const visitorsIdxs = await Promise.all(
        visitors.map(async (visitor) => {

          const [data, error] = await this._wsHelper.sendMessage({
            ...messagePayload,
            visitorName: `${visitor.names} ${visitor.surnames}`,
            visitorPhone: visitor.phone,
          });

          console.info({ data, error });

          if (data && !error) return visit.id;
        })
      );

      if (!visitorsIdxs.some(v => v)) {
        throw new ServiceException(QR_MESSAGE_FAIL);
      }

      return QR_MESSAGE_SUCCESS;
    });
  }

  async synchronizeStatus(cnx: EntityManager) {
    return cnx.transaction<string | null>(async (cnxTran) => {
      const visits = await this._repo.getInRange(cnxTran);

      if (!visits.length) return null;

      const visitsIdxs = visits.map(
        async ({ id, type, startDate, validityHours, status }) => {
          if (type !== VisitTypeEnum.QR) return;

          const diff = this._dateFormat.getDiffInMinutes(startDate);
          const validityMinutes = this._dateFormat.getMinutes(validityHours);

          const visitInProgress = {
            status: VisitStatusEnum.IN_PROGRESS,
          } as VisitEntity;

          const visitFulfilled = {
            status: VisitStatusEnum.FULFILLED,
          } as VisitEntity;

          const diffValidations: Partial<Record<VisitStatusEnum, boolean>> = {
            [VisitStatusEnum.PENDING]:
              status === VisitStatusEnum.PENDING &&
              diff > 0 &&
              diff < validityMinutes,

            [VisitStatusEnum.IN_PROGRESS]: diff >= validityMinutes,
          };

          if (diffValidations[VisitStatusEnum.PENDING]) {
            await this._repo.update(cnxTran, id, visitInProgress);
            return id;
          }

          if (diffValidations[VisitStatusEnum.IN_PROGRESS]) {
            await this._repo.update(cnxTran, id, visitFulfilled);
            return id;
          }
        }
      );

      const idxs = await Promise.all(visitsIdxs);

      if (!idxs.some(v => v)) return null;

      return VISITS_SYNC_STATUS_SUCCESS;
    });
  }

  async cancel(cnx: EntityManager, id: number) {
    return cnx.transaction(async (cnxTran) => {
      if (!global.user) {
        throw new ServiceException(ERR_401);
      }

      const userId = global.user.id;
      const mainResidency = await this._repoUser.getMainResidency(
        cnxTran,
        userId
      );

      if (!mainResidency) {
        throw new ServiceException(NO_EXIST_RECORD('residencia principal'));
      }

      const visit = await this._repo.getValidVisit(
        cnxTran,
        id,
        mainResidency.id
      );

      if (!visit) {
        throw new ServiceException(NO_EXIST_RECORD('la visita'));
      }

      const statusValidation: Partial<Record<VisitStatusEnum, boolean>> = {
        [VisitStatusEnum.FULFILLED]: true,
        [VisitStatusEnum.CANCELLED]: true,
      };

      if (statusValidation[visit.status]) return null;

      const visitData = {
        status: VisitStatusEnum.CANCELLED,
      } as VisitEntity;

      const visitUpdated = await this._repo.update(cnxTran, id, visitData);

      if (!visitUpdated) {
        throw new ServiceException(RECORD_EDIT_FAIL('la visita'));
      }

      return RECORD_EDIT('Visita');
    });
  }
}
