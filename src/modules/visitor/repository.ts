import { EntityManager } from 'typeorm';
import { VisitorEntity } from '../../database';
import { VisitorI } from '../../interfaces/visitor.interface';
import { GlobalEnum } from '../../enums/global.enum';
import {
  PaginationI,
  ResponsePaginationI,
} from '../../interfaces/global.interface';

export class VisitorRepository {

  async getAll(cnx: EntityManager, payload: PaginationI, residencyId?: number) {
    const {
      page = GlobalEnum.PAGE,
      limit = GlobalEnum.LIMIT,
      search = '',
    } = payload;

    const query = cnx
      .createQueryBuilder()
      .select([
        'visitor.id as id',
        'visitor.nombres as names',
        'visitor.apellidos as surnames',
        'visitor.cedula as "docNumber"',
        'visitor.id_residencia as "idResidency"',
      ])
      .from(VisitorEntity, 'visitor')
      .where('visitor.id_residencia = :residencyId', { residencyId });

    if (search.trim()) {
      query.andWhere(
        `visitor.nombre ILIKE :search OR
        visitor.apellidos ILIKE :search OR
        visitor.cedula ILIKE :search`,
        { search: `%${search}%` }
      );
    }

    const totalRecords = await query.getCount();
    const totalPages = Math.ceil(totalRecords / limit);

    const records = await query
      .limit(limit)
      .offset(limit * page - limit)
      .orderBy('visitor.id', 'ASC')
      .getRawMany<VisitorI>();

    const response: ResponsePaginationI<VisitorI> = {
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
    return cnx.findOne(VisitorEntity, {
      where: { id },
    });
  }

  create(cnx: EntityManager, payload: VisitorEntity) {
    const insert = cnx.create(VisitorEntity, payload);
    return cnx.save(insert);
  }
}
