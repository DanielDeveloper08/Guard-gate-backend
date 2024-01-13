import { EntityManager } from 'typeorm';
import { PersonEntity } from '../../database';

export class PersonRespository {

  getById(cnx: EntityManager, id: number) {
    return cnx.findOne(
      PersonEntity,
      { where: { id } },
    );
  }

  getByEmail(cnx: EntityManager, email: string) {
    return cnx.findOne(
      PersonEntity,
      { where: { email } },
    );
  }

  create(cnx: EntityManager, payload: PersonEntity) {
    const insert = cnx.create(PersonEntity, payload);
    return cnx.save(insert);
  }

  async update(cnx: EntityManager, id:number, payload: PersonEntity) {
    const update = await cnx.update(PersonEntity, { id }, payload);

    return update.affected;
  }
}
