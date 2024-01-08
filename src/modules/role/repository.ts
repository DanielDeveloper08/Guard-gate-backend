import { Admin, EntityManager } from 'typeorm';
import { OperationEntity, RoleEntity, RoleOperationEntity } from '../../database';
import { RoleTypeEnum } from '../../enums/role.enum';
import { PaginationI, ResponsePaginationI } from '../../interfaces/global.interface';
import { GlobalEnum } from '../../enums/global.enum';
import { RoleI } from '../../interfaces/role.interface';

export class RoleRepository {

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const {
      page = GlobalEnum.PAGE,
      limit = GlobalEnum.LIMIT,
      search = '',
    } = payload;

    const opQuery = cnx
      .createQueryBuilder()
      .select([
        'op.id as id',
        'op.nombre as name',
      ])
      .from(OperationEntity, 'op')
      .leftJoin(
        RoleOperationEntity,
        'role_op',
        'op.id = role_op.id_operacion AND role_op.id_rol = role.id'
      )
      .where('op.id = role_op.id_operacion')
      .groupBy('op.id')
      .orderBy('op.id', 'ASC')
      .getQuery();

    const query = cnx
      .createQueryBuilder()
      .select([
        'role.id as id',
        'role.name as name',
      ])
      .addSelect([
        `
        (
          SELECT COALESCE(json_agg(row_to_json(item)), '[]'::json)
          FROM (${opQuery}) item
        ) AS "operations"
      `,
      ])
      .from(RoleEntity, 'role');

    if (search.trim()) {
      query.where(`role.name ILIKE :search`, { search: `%${search}%` });
    }

    const totalRecords = await query.getCount();
    const totalPages = Math.ceil(totalRecords / limit);

    const records = await query
      .limit(limit)
      .offset(limit * page - limit)
      .orderBy('role.id', 'ASC')
      .getRawMany<RoleI>();

    const response: ResponsePaginationI<RoleI> = {
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
    return cnx.findOne(RoleEntity, {
      where: { id },
    });
  }

  getByRoleName(cnx: EntityManager, role: RoleTypeEnum) {
    return cnx.findOne(
      RoleEntity,
      { where: { name: role },
        relations: ['operations'],
      },
    );
  }

  create(cnx: EntityManager, payload: RoleEntity) {
    const insert = cnx.create(RoleEntity, payload);
    return cnx.save(insert);
  }

  async update(
    cnx: EntityManager,
    id: number,
    payload: RoleEntity
  ) {
    const update = await cnx.update(
      RoleEntity,
      { id },
      payload
    );

    return update.affected;
  }

  async remove(cnx: EntityManager, id: number) {
    const remove = await cnx.delete(RoleEntity, { id });
    return remove.affected;
  }
}
