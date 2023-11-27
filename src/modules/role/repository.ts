import { EntityManager } from 'typeorm';
import { RoleEntity } from '../../database';
import { RoleTypeEnum } from '../../enums/role.enum';

export class RoleRepository {

  getByRoleName(cnx: EntityManager, role: RoleTypeEnum) {
    return cnx.findOne(
      RoleEntity,
      { where: { name: role } },
    );
  }

  create(cnx: EntityManager, payload: RoleEntity) {
    const insert = cnx.create(RoleEntity, payload);
    return cnx.save(insert);
  }
}
