import { EntityManager } from 'typeorm';
import { UserEntity } from '../../database';
import { UserRepository } from './repository';
import { NO_EXIST_RECORD } from '../../shared/messages';
import { ResidencyRepository } from '../residency/repository';
import { ServiceException } from '../../shared/service-exception';
import { MainResidencyPayloadI } from '../../interfaces/user.interface';

export class UserService {

  constructor(
    private readonly _repo = new UserRepository(),
    private readonly _repoResidency = new ResidencyRepository(),
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

  async setMainResidency(
    cnx: EntityManager,
    payload: MainResidencyPayloadI
  ) {
    const { idUsuario, idResidencia } = payload;

    const user = await this._repo.getById(cnx, idUsuario);
    const residency = await this._repoResidency.getById(cnx, idResidencia);

    if (!user) {
      throw new ServiceException(NO_EXIST_RECORD('usuario'));
    }

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia'));
    }

    const residences = await this._repoResidency.getByUserId(cnx, idUsuario);

    if (!residences.length) return null;


    const idxs = residences.filter(r => r.esPrincipal).map(r => r.id);

    return residences;
  }
}
