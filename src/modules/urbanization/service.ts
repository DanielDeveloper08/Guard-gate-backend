import { EntityManager } from 'typeorm';
import { UrbanizationEntity } from '../../database';
import { UrbanizationRepository } from './repository';
import { UrbanizationDTO } from '../../interfaces/urbanization.interface';
import { ServiceException } from '../../shared/service-exception';
import {
  EXISTS_RECORD,
  NO_EXIST_RECORD,
  RECORD_CREATED_FAIL,
  RECORD_EDIT,
  RECORD_EDIT_FAIL,
} from '../../shared/messages';

export class UrbanizationService {

  constructor(
    private readonly _repo = new UrbanizationRepository(),
  ) {}

  getOne(cnx: EntityManager, id: number) {
    return this._repo.getById(cnx, id);
  }

  create(cnx: EntityManager, payload: UrbanizationDTO) {
    return cnx.transaction(async (cnxTran) => {
      const { name, address } = payload;

      const existsUrba = await this._repo.getByName(cnxTran, name);

      if (existsUrba) {
        throw new ServiceException(EXISTS_RECORD('urbanización'));
      }

      const urbanData = {
        name,
        address,
      } as UrbanizationEntity;

      const urbanCreated = await this._repo.create(cnxTran, urbanData);

      if (!urbanCreated) {
        throw new ServiceException(RECORD_CREATED_FAIL('urbanización'));
      }

      return urbanCreated;
    });
  }

  async update(cnx: EntityManager, id: number, payload: UrbanizationDTO) {
    return cnx.transaction(async (cnxTran) => {
      const { name, address } = payload;

      const urbanization = await this._repo.getById(cnxTran, id);

      if (!urbanization) {
        throw new ServiceException(NO_EXIST_RECORD('urbanización'));
      }

      const urbanData = {
        name,
        address,
      } as UrbanizationEntity;

      const urbanUpdated = await this._repo.update(cnxTran, id, urbanData);

      if (!urbanUpdated) {
        throw new ServiceException(RECORD_EDIT_FAIL('urbanización'));
      }

      return RECORD_EDIT('Urbanización');
    });
  }
}
