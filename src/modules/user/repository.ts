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

  getByUser(cnx: EntityManager, user: string, withPass: boolean = false) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'person.nombres as names',
        'person.apellidos as surnames',
        'person.correo as email',
        'person.telefono as phone',
        'role.name as role',
      ])
      .from(UserEntity, 'user')
      .leftJoin(PersonEntity, 'person', 'user.id_persona = person.id')
      .leftJoin(RoleEntity, 'role', 'user.id_rol = role.id')
      .where('user.usuario = :user', { user })
      .andWhere('user.estado = :status', { status: true })

    if (withPass) {
      query.addSelect('user.contrasenia as password');
    }

    return query.getRawOne<UserI>();
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
