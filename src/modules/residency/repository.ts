import { EntityManager } from 'typeorm';
import { PersonEntity, ResidencyEntity, UserEntity } from '../../database';
import { ResidencyI } from '../../interfaces/residency.interface';
import { PaginationI, ResponsePaginationI } from '../../interfaces/global.interface';
import { GlobalEnum } from '../../enums/global.enum';

export class ResidencyRepository {

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const {
      page = GlobalEnum.PAGE,
      limit = GlobalEnum.LIMIT,
      search = '',
    } = payload;

    const query = cnx
      .createQueryBuilder()
      .select([
        'residency.id as id',
        'residency.manzana as block',
        'residency.villa as town',
        'residency.urbanizacion as urbanization',
        'residency.id_persona as "personId"',
      ])
      .from(ResidencyEntity, 'residency');

    if (search.trim()) {
      query.where(
        `residency.manzana ILIKE :search OR
        residency.villa ILIKE :search OR
        residency.urbanizacion ILIKE :search`,
        { search: `%${search}%` }
      );
    }

    const totalRecords = await query.getCount();
    const totalPages = Math.ceil(totalRecords / limit);

    const records = await query
      .limit(limit)
      .offset(limit * page - limit)
      .orderBy('residency.id', 'ASC')
      .getRawMany<ResidencyI>();

    const response: ResponsePaginationI<ResidencyI> = {
      records,
      meta: {
        page: Number(page),
        totalPages,
        totalRecords,
      },
    };

    return response;
  }

  getByUserId(cnx: EntityManager, userId: number) {
    const query = cnx
      .createQueryBuilder()
      .from(ResidencyEntity, 'residency')
      .leftJoin(PersonEntity, 'person', 'residency.id_persona = person.id')
      .leftJoin(UserEntity, 'user', 'person.id = user.id_persona')
      .where('user.id = :userId', { userId });

    return query.getRawMany<ResidencyEntity>();
  }

  getById(cnx: EntityManager, id: number) {
    return cnx.findOne(ResidencyEntity, {
      where: { id },
    });
  }

  getByPersonId(cnx: EntityManager, personId: number) {
    return cnx.findOne(ResidencyEntity, {
      where: { personId },
    });
  }

  create(cnx: EntityManager, payload: ResidencyEntity) {
    const insert = cnx.create(ResidencyEntity, payload);
    return cnx.save(insert);
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

  async remove(cnx: EntityManager, id: number) {
    const remove = await cnx.delete(ResidencyEntity, { id });
    return remove.affected;
  }

  async disableMain(cnx: EntityManager) {
    const update = await cnx
      .createQueryBuilder()
      .update(ResidencyEntity)
      .set({
        isMain: false,
        updatedAt: new Date(),
      })
      .where('es_principal = true')
      .execute();

    return update.affected;
  }

  async setMain(
    cnx: EntityManager,
    id: number,
  ) {
    const update = await cnx.update(
      ResidencyEntity,
      { id },
      { isMain: true }
    );

    return update.affected;
  }
}
