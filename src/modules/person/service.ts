import { EntityManager } from 'typeorm';
import { PersonRespository } from './repository';
import { PaginationI } from '../../interfaces/global.interface';

export class PersonService {

  constructor(
    private readonly _repo = new PersonRespository(),
  ) {}

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const data = await this._repo.getAll(cnx, payload);
    return data;
  }
}
