import { EntityManager } from 'typeorm';
import { RoleOperationEntity } from '../../database';

export class RoleOperationRepository {

  getAnotherOperations(
    cnx: EntityManager,
    id: number,
    operationsIds: number[]
  ) {
    const query = cnx
      .createQueryBuilder()
      .select('id_operacion as id')
      .from(RoleOperationEntity, 'role_op')
      .where('id_rol = :id', { id })
      .andWhere('id_operacion NOT IN (:...ids)', { ids: operationsIds });

    return query.getRawMany<Record<'id', number>>();
  }

  async resetOperation(
    cnx: EntityManager,
    id: number,
    operationsIds: number[]
  ) {
    const update = await cnx
      .createQueryBuilder()
      .delete()
      .from(RoleOperationEntity)
      .where('id_rol = :id', { id })
      .andWhere('id_operacion NOT IN (:...ids)', { ids: operationsIds })
      .execute();

    return update.affected;
  }

  async removeOpByRoleId(cnx: EntityManager, roleId: number) {
    const remove = await cnx.delete(RoleOperationEntity, { roleId });
    return remove.affected;
  }

  getOperation(cnx: EntityManager, roleId: number, operationId: number) {
    return cnx.findOne(RoleOperationEntity, {
      where: {
        roleId,
        operationId,
      },
    });
  }

  addOperation(cnx: EntityManager, payload: RoleOperationEntity) {
    const insert = cnx.create(RoleOperationEntity, payload);
    return cnx.save(insert);
  }
}
