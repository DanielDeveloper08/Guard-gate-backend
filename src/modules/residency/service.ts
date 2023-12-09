import { EntityManager } from 'typeorm';
import { ResidencyRepository } from './repository';
import { PaginationI } from '../../interfaces/global.interface';
import { ResidencyDTO } from '../../interfaces/residency.interface';
import { ResidencyEntity } from '../../database';
import { ServiceException } from '../../shared/service-exception';
import {
  NO_EXIST_RECORD,
  RECORD_CREATED_FAIL,
  RECORD_DELETE,
  RECORD_DELETE_FAIL,
  RECORD_EDIT,
  RECORD_EDIT_FAIL,
} from '../../shared/messages';
import { PersonRespository } from '../person/repository';

export class ResidencyService {

  constructor(
    private readonly _repo = new ResidencyRepository(),
    private readonly _repoPerson = new PersonRespository(),
  ) {}

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const data = await this._repo.getAll(cnx, payload);
    return data;
  }

  async getOne(cnx: EntityManager, id: number) {
    const residency = await this._repo.getById(cnx, id);

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('la residencia'));
    }

    return residency;
  }

  async create(cnx: EntityManager, payload: ResidencyDTO) {
    const { block, town, urbanization, personId } = payload;

    const person = await this._repoPerson.getById(cnx, personId);

    if (!person) {
      throw new ServiceException(NO_EXIST_RECORD('persona'));
    }

    const existsResidency = await this._repo.getByPersonId(cnx, personId);

    const residencyData = {
      block,
      town,
      urbanization,
      personId,
      isMain: !existsResidency,
    } as ResidencyEntity;

    const residencyCreated = await this._repo.create(cnx, residencyData);

    if (!residencyCreated) {
      throw new ServiceException(RECORD_CREATED_FAIL('la residencia'));
    }

    return residencyCreated;
  }

  async update(cnx: EntityManager, id: number, payload: ResidencyDTO) {
    const { block, town, urbanization, personId } = payload;

    const residency = await this._repo.getById(cnx, id);
    const person = await this._repoPerson.getById(cnx, personId);

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('la residencia'));
    }

    if (!person) {
      throw new ServiceException(NO_EXIST_RECORD('persona'));
    }

    const residencyData = {
      block,
      town,
      urbanization,
      personId,
    } as ResidencyEntity;

    const residencyUpdated = await this._repo.update(cnx, id, residencyData);

    if (!residencyUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL('la residencia'));
    }

    return RECORD_EDIT('Residencia');
  }

  async remove(cnx: EntityManager, id: number) {
    const residency = await this._repo.getById(cnx, id);

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('la residencia'));
    }

    const residencyRemoved = await this._repo.remove(cnx, id);

    if (!residencyRemoved) {
      throw new ServiceException(RECORD_DELETE_FAIL('la residencia'));
    }

    return RECORD_DELETE('Residencia');
  }
}
