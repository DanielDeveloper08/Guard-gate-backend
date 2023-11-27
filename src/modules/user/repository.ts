import { EntityManager } from 'typeorm';
import { PersonEntity, RoleEntity, UserEntity } from '../../database';
import { UserI } from '../../interfaces/user.interface';

export class UserRepository {

  getAll(cnx: EntityManager) {
    return cnx.find(
      UserEntity,
      { select: ['id', 'user', 'status'] }
    );
  }

  getByUser(cnx: EntityManager, user: string) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'person.nombres as name',
        'person.apellidos as surnames',
        'person.correo as email',
        'person.telefono as phone',
        'role.name as role',
        'user.contrasenia as password',
      ])
      .from(UserEntity, 'user')
      .leftJoin(PersonEntity, 'person', 'user.id_persona = person.id')
      .leftJoin(RoleEntity, 'role', 'user.id_rol = role.id')
      .where('user.usuario = :user', { user })
      .andWhere('user.estado = true')
      .getRawOne<UserI>();

    return query;
  }

  create(cnx: EntityManager, payload: UserEntity) {
    const insert = cnx.create(UserEntity, payload);
    return cnx.save(insert);
  }

  async update(
    cnx: EntityManager,
    id: number,
    payload: UserEntity
  ) {
    const update = await cnx.update(
      UserEntity,
      { id },
      payload
    );

    return update.affected;
  }
}
