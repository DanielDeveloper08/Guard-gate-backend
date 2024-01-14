import { EntityManager } from 'typeorm';
import { UserEntity } from '../../database';
import { UserRepository } from './repository';
import { ResidencyRepository } from '../residency/repository';
import { ServiceException } from '../../shared/service-exception';
import { ERR_401, NO_EXIST_RECORD, RECORD_EDIT, RECORD_EDIT_FAIL } from '../../shared/messages';

export class UserService {

  constructor(
    private readonly _repo = new UserRepository(),
    private readonly _repoResidency = new ResidencyRepository(),
  ) {}

  getAll(cnx: EntityManager): Promise<UserEntity[]> {
    return this._repo.getAll(cnx);
  }

  async getByUsername(
    cnx: EntityManager,
    user: string
  ) {
    const userFound = await this._repo.getByUsername(cnx, user);
    if (!userFound) return null;

    return userFound;
  }

  async existsUser(cnx: EntityManager, id: number): Promise<boolean> {
    const userFound = await this._repo.getById(cnx, id);
    return !!userFound;
  }

  async getResidencesByUserId(cnx: EntityManager) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const userId = global.user.id;
    const userInfo = await this._repo.getResidencesByUserId(cnx, userId);

    if (!userInfo) {
      throw new ServiceException(NO_EXIST_RECORD('usuario'));
    }

    return userInfo;
  }

  async getAllUsers(cnx: EntityManager) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }
    
    return (await this._repo.getAllUsers(cnx)).map(user=>({
      id:user.id,
      username:user.user,
      roleId:user.roleId,
      names: user.person.names,
      surnames: user.person.surnames,
      email: user.person.email,
      phone: user.person.phone,
      role:user.role.name
    }));
  }

  async getUsersByRoleId(cnx: EntityManager, roleId:number) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }
    
    return (await this._repo.getUsersByRoleId(cnx, roleId)).map(user=>({
      id:user.id,
      username:user.user,
      roleId:user.roleId,
      names: user.person.names,
      surnames: user.person.surnames,
      email: user.person.email,
      phone: user.person.phone,
      role:user.role.name
    }));
  }

  async getById(cnx: EntityManager , id:number) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }
    const user = await this._repo.getUserById(cnx,id);

    if(!user){
      throw new ServiceException(NO_EXIST_RECORD('usuario')); 
    }
    
    return {
      id:user.id,
      username:user.user,
      roleId:user.roleId,
      names: user.person.names,
      surnames: user.person.surnames,
      email: user.person.email,
      phone: user.person.phone,
      role:user.role.name,
      residences:user.person.residences.map(residency=>({
        id:residency.id,
        block:residency.block,
        town:residency.town,
        urbanization: residency.urbanization,
        isMain: residency.isMain,
      }))
    };
  }

  async getUsers(cnx: EntityManager) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }
    
    return (await this._repo.getAllUsers(cnx)).map(user=>({
      id:user.id,
      username:user.user,
      roleId:user.roleId,
      names: user.person.names,
      surnames: user.person.surnames,
      email: user.person.email,
      phone: user.person.phone,
      role:user.role.name
    }));
  }

  async setMainResidency(
    cnx: EntityManager,
    residencyId: number
  ) {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    const userId = global.user.id;
    const user = await this._repo.getById(cnx, userId);
    const residency = await this._repoResidency.getById(cnx, residencyId);

    if (!user) {
      throw new ServiceException(NO_EXIST_RECORD('usuario'));
    }

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('residencia'));
    }

    const residences = await this._repoResidency.getByUserId(cnx, userId);

    if (!residences.length) return null;

    await this._repoResidency.disableMain(cnx);

    const residencyUpdated = await this._repoResidency.setMain(cnx, residencyId);

    if (!residencyUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL('residencia como principal'));
    }

    return RECORD_EDIT('Residencia principal');
  }

  notifyPanicAlert() {
    if (!global.user) {
      throw new ServiceException(ERR_401);
    }

    return Promise.resolve('Notificación enviada');
  }
}
