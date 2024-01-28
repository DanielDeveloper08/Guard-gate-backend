import { EntityManager } from 'typeorm';
import { OperationEntity } from '../../database';
import { RoleRepository } from './repository';
import { OperationRepository } from '../operation/repository';
import { PaginationI } from '../../interfaces/global.interface';
import { UpdateRoleDTO } from '../../interfaces/role.interface';
import { ServiceException } from '../../shared/service-exception';
import { NO_EXIST_RECORD, RECORD_EDIT } from '../../shared/messages';
import { RoleOperationRepository } from '../role-operation/repository';
import { RoleTypeEnum } from '../../enums/role.enum';

export class RoleService {

  constructor(
    private readonly _repo = new RoleRepository(),
    private readonly _repoOperation = new OperationRepository(),
    private readonly _repoRoleOp = new RoleOperationRepository()
  ) {}

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const data = await this._repo.getAll(cnx, payload);
    return data;
  }

  async getAllOperations(cnx: EntityManager) {
    const data = await this._repoOperation.getAll(cnx);

    return data.map((datum) => ({
      id: datum.id,
      name: datum.name,
      route: datum.route,
      moduleId: datum.moduleId,
      status: datum.status,
    }));
  }

  async getRoleByName(cnx: EntityManager, payload: RoleTypeEnum) {
    const data = await this._repo.getByRoleName(cnx, payload);

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      operations: data.operations!.map((operation) => ({
        id: operation.id,
        name: operation.name,
        moduleId: operation.moduleId,
        route: operation.route,
      })),
    };
  }

  async update(cnx: EntityManager, id: number, payload: UpdateRoleDTO) {
    return cnx.transaction(async (cnxTran) => {
      const { operationsIds } = payload;

      const role = await this._repo.getById(cnxTran, id);

      if (!role) {
        throw new ServiceException(NO_EXIST_RECORD('el rol'));
      }

      if (!operationsIds.length) {
        const allOp = await this._repoRoleOp.getAllOpByRoleId(cnxTran, id);
        const idxs = allOp.map(op => op.id);

        await this._repoOperation.resetOperations(cnxTran, idxs);

        return RECORD_EDIT('Rol');
      }

      for (const opId of operationsIds) {
        const operation = await this._repoOperation.getById(cnxTran, opId);

        if (!operation) {
          throw new ServiceException(
            NO_EXIST_RECORD(`la operación con ID: ${opId}`)
          );
        }

        const existsOp = await this._repoRoleOp.getValidOperation(
          cnxTran,
          id,
          opId
        );

        if (existsOp) continue;

        const updateData = {
          status: true,
          updatedAt: new Date(),
        } as OperationEntity;

        await this._repoOperation.update(cnxTran, opId, updateData);
      }

      await this._repoOperation.disableOperations(cnxTran, operationsIds);

      return RECORD_EDIT('Rol');
    });
  }
}
