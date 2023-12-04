import { EntityManager } from 'typeorm';
import { RoleEntity, RoleOperationEntity } from '../../database';
import { RoleRepository } from './repository';
import { OperationRepository } from '../operation/repository';
import { PaginationI } from '../../interfaces/global.interface';
import { UpdateRoleDTO } from '../../interfaces/role.interface';
import { ServiceException } from '../../shared/service-exception';
import {
  NO_EXIST_RECORD,
  RECORD_EDIT,
  RECORD_EDIT_FAIL,
} from '../../shared/messages';
import { RoleOperationRepository } from '../role-operation/repository';

export class RoleService {

  constructor(
    private readonly _repo = new RoleRepository(),
    private readonly _repoOperation = new OperationRepository(),
    private readonly _repoRoleOp = new RoleOperationRepository(),
  ) {}

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const data = await this._repo.getAll(cnx, payload);
    return data;
  }

  async update(cnx: EntityManager, id: number, payload: UpdateRoleDTO) {
    const { name, operationsIds } = payload;

    const role = await this._repo.getById(cnx, id);

    if (!role) {
      throw new ServiceException(NO_EXIST_RECORD('el role'));
    }

    const roleData = {
      name,
    } as RoleEntity;

    const roleUpdated = await this._repo.update(cnx, id, roleData);

    if (!roleUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL('el role'));
    }

    if (!operationsIds.length) {
      await this._repoRoleOp.removeOpByRoleId(cnx, id);

      return RECORD_EDIT('Rol');
    }

    for (const opId of operationsIds) {
      const operation = await this._repoOperation.getById(cnx, opId);

      if (!operation) {
        throw new ServiceException(
          NO_EXIST_RECORD(`la operación con ID: ${opId}`)
        );
      }

      const existsOp = await this._repoRoleOp.getOperation(cnx, id, opId);

      if (existsOp) continue;

      const opData = {
        roleId: id,
        operationId: opId,
      } as RoleOperationEntity;

      await this._repoRoleOp.addOperation(cnx, opData);
    }

    const anothersOp = await this._repoRoleOp.getAnotherOperations(
      cnx,
      id,
      operationsIds
    );

    if (!anothersOp.length) return RECORD_EDIT('Rol');

    const operationsUpdated = await this._repoRoleOp.resetOperation(
      cnx,
      id,
      operationsIds
    );

    if (!operationsUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL('las operaciones del rol'));
    }

    return RECORD_EDIT('Rol');
  }
}
