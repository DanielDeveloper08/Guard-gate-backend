import { EntityManager } from 'typeorm';
import { UserEntity } from '../../database';
import { UserRepository } from './repository';
import { ServiceException } from '../../shared/service-exception';
import { NO_EXIST_RECORD } from '../../shared/messages';

export class UserService {

  constructor(
    private readonly _repo = new UserRepository(),
  ) {}

  getAll(cnx: EntityManager): Promise<UserEntity[]> {
    return this._repo.getAll(cnx);
  }

  async getByUser(
    cnx: EntityManager,
    user: string
  ) {
    const userFound = await this._repo.getByUser(cnx, user);
    if (!userFound) return null;

    return userFound;
  }

  async existsUser(cnx: EntityManager, id: number): Promise<boolean> {
    const userFound = await this._repo.getById(cnx, id);
    return !!userFound;
  }

  async getResidencesByUserId(cnx: EntityManager, id: number) {
    const userInfo = await this._repo.getResidencesByUserId(cnx, id);

    if (!userInfo) {
      throw new ServiceException(NO_EXIST_RECORD('usuario'));
    }

    return userInfo;
  }
}
