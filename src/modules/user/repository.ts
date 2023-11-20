import { EntityManager } from 'typeorm';
import { UserEntity } from '../../database';

export class UserRepository {

  getAll(cnx: EntityManager) {
    return cnx.find(
      UserEntity,
      { select: ['id', 'user', 'status'] }
    );
  }

  getByUser(cnx: EntityManager, user: string) {
    return cnx.findOne(
      UserEntity,
      { where: { user, status: true } },
    );
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
