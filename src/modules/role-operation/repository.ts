import { EntityManager } from 'typeorm';
import { OperationEntity, RoleOperationEntity } from '../../database';

export class RoleOperationRepository {

  getAllOpByRoleId(cnx: EntityManager, roleId: number) {
    const query = cnx
      .createQueryBuilder()
      .select('role_op.id_operacion as id')
      .from(RoleOperationEntity, 'role_op')
      .where('role_op.id_rol = :roleId', { roleId });

    return query.getRawMany<Record<'id', number>>();
  }

  getOperation(cnx: EntityManager, roleId: number, operationId: number) {
    return cnx.findOne(RoleOperationEntity, {
      where: {
        roleId,
        operationId,
      },
    });
  }

  getValidOperation(
    cnx: EntityManager,
    roleId: number,
    operationId: number
  ) {
    const query = cnx
      .createQueryBuilder()
      .select('op.id as id')
      .from(RoleOperationEntity, 'role_op')
      .leftJoin(OperationEntity, 'op', 'role_op.id_operacion = op.id')
      .where('role_op.id_rol = :roleId', { roleId })
      .andWhere('op.id = :operationId', { operationId })
      .andWhere('op.estado = true');

    return query.getRawOne<Record<'id', number>>();
  }
}
