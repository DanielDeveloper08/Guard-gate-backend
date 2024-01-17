import { EntityManager } from 'typeorm';
import { PersonEntity, ResidencyEntity } from '../../database';
import { PaginationI, ResponsePaginationI } from '../../interfaces/global.interface';
import { GlobalEnum } from '../../enums/global.enum';
import { PersonI } from '../../interfaces/person.interface';

export class PersonRespository {

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const {
      page = GlobalEnum.PAGE,
      limit = GlobalEnum.LIMIT,
      search = '',
    } = payload;

    const residencyQuery = cnx
      .createQueryBuilder()
      .select([
        'residency.id as id',
        'residency.manzana as block',
        'residency.villa as town',
        'residency.urbanizacion as urbanization',
        'residency.es_principal as "isMain"',
      ])
      .from(ResidencyEntity, 'residency')
      .where('person.id = residency.id_persona')
      .groupBy('residency.id')
      .orderBy('residency.id', 'ASC')
      .getQuery();

    const query = cnx
      .createQueryBuilder()
      .select([
        'person.id as id',
        'person.nombres as names',
        'person.apellidos as surnames',
        'person.correo as email',
        'person.telefono as phone',
      ])
      .addSelect([
        `
        (
          SELECT COALESCE(json_agg(row_to_json(item)), '[]'::json)
          FROM (${residencyQuery}) item
        ) AS "residences"
      `,
      ])
      .from(PersonEntity, 'person');

    if (search.trim()) {
      query.where(
        `person.nombres ILIKE :search OR
        person.apellidos ILIKE :search OR
        person.correo ILIKE :search OR
        person.telefono ILIKE :search`,
        { search: `%${search}%` }
      );
    }

    const totalRecords = await query.getCount();
    const totalPages = Math.ceil(totalRecords / limit);

    const records = await query
      .limit(limit)
      .offset((limit * page) - limit)
      .orderBy('person.id', 'ASC')
      .getRawMany<PersonI>();

    const response: ResponsePaginationI<PersonI> = {
      records,
      meta: {
        page: Number(page),
        totalPages,
        totalRecords,
      },
    };

    return response;
  }

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
