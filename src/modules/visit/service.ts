import { EntityManager } from 'typeorm';
import { NotificationPayloadI, SaveVisitDetailI, VisitDTO } from '../../interfaces/visit.interface';
import { VisitRepository } from './repository';
import { UserRepository } from '../user/repository';
import { TypeVisitRepository } from '../type-visit/repository';
import { VisitStatusRepository } from '../visit-status/repository';
import { VisitVisitorRepository } from '../visit-visitor/repository';
import { ServiceException } from '../../shared/service-exception';
import {
  ERR_401,
  NO_EXIST_RECORD,
  QR_MESSAGE_SUCCESS,
  REASON_VISIT,
  RECORD_CREATED_FAIL,
  RECORD_EDIT,
  RECORD_EDIT_FAIL,
  VALID_LIST_VISITORS,
  VISITOR_HAS_ENTERED,
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
import { EncryptorHelper, WsHelper } from '../../helpers';
import { SendMessageI } from '../../interfaces/ws.interface';

export class VisitService {

  constructor(
    private readonly _repo = new VisitRepository(),
    private readonly _repoUser = new UserRepository(),
    private readonly _repoVisitStatus = new VisitStatusRepository(),
    private readonly _repoTypeVisit = new TypeVisitRepository(),
    private readonly _repoVisitor = new VisitorRepository(),
    private readonly _repoVisitVisitor = new VisitVisitorRepository(),
    private readonly _wsHelper = new WsHelper(),
    private readonly _encryptor = new EncryptorHelper(),
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

      const { startDate, validityHours, listVisitors, reason, type } = payload;

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
        reason: reason ?? REASON_VISIT(residency.urbanization),
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
      const { visitId, visitorId, observation, carPlate, photos } = payload;

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
        hasEntered: true,
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

      const {
        visitId,
        base64Img,
      } = payload;

      const visit = await this._repo.getById(cnxTran, visitId);

      if (!visit) {
        throw new ServiceException(NO_EXIST_RECORD('la visita'));
      }

      const visitors = visit.visitors.filter(visitor => visitor.phone);

      if (!visitors.length) return null;

      const messagePayload = {
        residentName: visit.generatedBy,
      } as SendMessageI;

      await Promise.all(
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


      return QR_MESSAGE_SUCCESS;
    });
  }
}
