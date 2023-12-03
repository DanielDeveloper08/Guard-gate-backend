import { EntityManager } from 'typeorm';
import { ResidencyRepository } from './repository';
import { PaginationI } from '../../interfaces/global.interface';
import { ResidencyDTO } from '../../interfaces/residency.interface';
import { ResidencyEntity } from '../../database';
import { ServiceException } from '../../shared/service-exception';
import { NO_EXIST_RECORD, RECORD_CREATED_FAIL } from '../../shared/messages';
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

  async create(cnx: EntityManager, payload: ResidencyDTO) {
    const {
      block,
      town,
      urbanization,
      personId,
    } = payload;

    const person = await this._repoPerson.getById(cnx, personId);

    if (!person) {
      throw new ServiceException(NO_EXIST_RECORD('persona'));
    }

    const residencyData = {
      block,
      town,
      urbanization,
      personId,
    } as ResidencyEntity;

    const residencyCreated = await this._repo.create(cnx, residencyData);

    if (!residencyCreated) {
      throw new ServiceException(RECORD_CREATED_FAIL('la residencia'));
    }

    return residencyCreated;
  }
}
