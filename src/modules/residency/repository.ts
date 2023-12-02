import { EntityManager, In } from 'typeorm';
import { PersonEntity, ResidencyEntity, UserEntity } from '../../database';
import { ResidencyI } from '../../interfaces/residency.interface';

export class ResidencyRepository {

  getByUserId(cnx: EntityManager, userId: number) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'residency.id as id',
        'residency.manzana',
        'residency.villa',
        'residency.urbanizacion',
        'residency.es_Principal as "esPrincipal"',
      ])
      .from(ResidencyEntity, 'residency')
      .leftJoin(PersonEntity, 'person', 'residency.id_persona = person.id')
      .leftJoin(UserEntity, 'user', 'person.id = user.id_persona')
      .where('user.id = :userId', { userId });

    return query.getRawMany<ResidencyI>();
  }

  getById(cnx: EntityManager, id: number) {
    return cnx.findOne(ResidencyEntity, {
      where: { id },
    });
  }

  async update(
    cnx: EntityManager,
    id: number,
    payload: ResidencyEntity
  ) {
    const update = await cnx.update(
      ResidencyEntity,
      { id },
      payload
    );

    return update.affected;
  }


  async disableMain(
    cnx: EntityManager,
    idxs: Array<number>
  ) {
    const update = await cnx
      .createQueryBuilder()
      .update(ResidencyEntity)
      .set({
        isMain: false,
      })
      .where('id IN (:...idxs)', { idxs })
      .execute();

    return update.affected;
  }
}
