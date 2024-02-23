import { EntityManager } from 'typeorm';
import { UrbanizationEntity } from '../../database';

export class UrbanizationRepository {

  getById(cnx: EntityManager, id: number) {
    return cnx.findOne(UrbanizationEntity, {
      where: { id },
    });
  }

  getByName(cnx: EntityManager, name: string) {
    return cnx.findOne(UrbanizationEntity, {
      where: { name },
    });
  }

  create(cnx: EntityManager, payload: UrbanizationEntity) {
    const insert = cnx.create(UrbanizationEntity, payload);
    return cnx.save(insert);
  }

  async update(
    cnx: EntityManager,
    id: number,
    payload: UrbanizationEntity
  ) {
    const update = await cnx.update(
      UrbanizationEntity,
      { id },
      payload
    );

    return update.affected;
  }
}
