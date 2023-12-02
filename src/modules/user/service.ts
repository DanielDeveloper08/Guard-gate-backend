import { EntityManager } from 'typeorm';
import { UserEntity } from '../../database';
import { UserRepository } from './repository';
import { ResidencyRepository } from '../residency/repository';
import { ServiceException } from '../../shared/service-exception';
import { MainResidencyPayloadI } from '../../interfaces/user.interface';
import { NO_EXIST_RECORD, RECORD_EDIT, RECORD_EDIT_FAIL } from '../../shared/messages';

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

    await this._repoResidency.disableMain(cnx);

    const residencyUpdated = await this._repoResidency.setMain(cnx, idResidencia);

    if (!residencyUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL('residencia como principal'));
    }

    return RECORD_EDIT('Residencia');
  }
}
