import { EntityManager } from 'typeorm';
import {
  PersonEntity,
  ResidencyEntity,
  VisitEntity,
  VisitVisitorEntity,
  VisitorEntity,
} from '../../database';
import { VisitI, VisitInRangeI } from '../../interfaces/visit.interface';
import {
  IDateFilter,
  PaginationI,
  ResponsePaginationI,
} from '../../interfaces/global.interface';
import { GlobalEnum } from '../../enums/global.enum';
import { VisitStatusEnum } from '../../enums/visit.enum';

export class VisitRepository {

  async getAll(
    cnx: EntityManager,
    payload: PaginationI,
    mainResidencyId: number
  ) {
    const {
      page = GlobalEnum.PAGE,
      limit = GlobalEnum.LIMIT,
      search = '',
    } = payload;

    const visitorQuery = cnx
      .createQueryBuilder()
      .select([
        'visitor.id as id',
        'visitor.nombres as names',
        'visitor.apellidos as surnames',
        'visitor.cedula as "docNumber"',
        'visitor.telefono as phone',
        'visitor.estado as status',
        'visitor.id_residencia as "idResidency"',
        'visit_visitor.ha_ingresado as "hasEntered"',
        'visit_visitor.fecha_ingreso as "entryDate"',
        'visit_visitor.placa_carro as "carPlate"',
        'visit_visitor.observacion as observation',
        `COALESCE(visit_visitor.fotos, '[]'::json) as photos`,
      ])
      .from(VisitorEntity, 'visitor')
      .leftJoin(
        VisitVisitorEntity,
        'visit_visitor',
        'visitor.id = visit_visitor.id_visitante'
      )
      .where('visit.id = visit_visitor.id_visita')
      .groupBy('visitor.id')
      .addGroupBy('visit_visitor.id')
      .orderBy('visitor.id', 'ASC')
      .getQuery();

    const query = cnx
      .createQueryBuilder()
      .select([
        'visit.id as id',
        'visit.fecha_inicio as "startDate"',
        'visit.fecha_fin as "endDate"',
        'visit.horas_validez as "validityHours"',
        'visit.motivo as reason',
        `CONCAT(person.names, ' ', person.surnames) as "generatedBy"`,
        'visit.estado as status',
        'visit.id_residencia as "idResidency"',
        'visit.tipo as type',
      ])
      .addSelect([
        `
        (
          SELECT COALESCE(json_agg(row_to_json(item)), '[]'::json)
          FROM (${visitorQuery}) item
        ) AS "visitors"
      `,
      ])
      .from(VisitEntity, 'visit')
      .leftJoin(ResidencyEntity, 'residency', 'visit.id_residencia = residency.id')
      .leftJoin(PersonEntity, 'person', 'residency.id_persona = person.id')
      .where('visit.id_residencia = :mainResidencyId', { mainResidencyId });

    if (search.trim()) {
      query.andWhere(
        `visit.motivo ILIKE :search`,
        { search: `%${search}%` }
      );
    }

    const totalRecords = await query.getCount();
    const totalPages = Math.ceil(totalRecords / limit);

    const records = await query
      .limit(limit)
      .offset(limit * page - limit)
      .orderBy('visit.id', 'ASC')
      .getRawMany<VisitI>();

    const response: ResponsePaginationI<VisitI> = {
      records,
      meta: {
        page: Number(page),
        totalPages,
        totalRecords,
      },
    };

    return response;
  }

  async getStatusSummary(
    cnx: EntityManager,
    payload: IDateFilter
  ) {
    const {
      fromDate,
      toDate
    } = payload;

    return cnx
      .createQueryBuilder()
      .select([
        'visit.estado as status',
        'COUNT(*) as count'
      ])
      .from(VisitEntity, 'visit')
      .where('DATE(visit.fecha_inicio) BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .groupBy('visit.estado')
      .orderBy('visit.estado', 'ASC')
      .getRawMany();
  }

  getById(cnx: EntityManager, id: number) {
    const visitorQuery = cnx
      .createQueryBuilder()
      .select([
        'visitor.id as id',
        'visitor.nombres as names',
        'visitor.apellidos as surnames',
        'visitor.cedula as "docNumber"',
        'visitor.telefono as phone',
        'visitor.estado as status',
        'visitor.id_residencia as "idResidency"',
        'visit_visitor.ha_ingresado as "hasEntered"',
        'visit_visitor.fecha_ingreso as "entryDate"',
        'visit_visitor.placa_carro as "carPlate"',
        'visit_visitor.observacion as observation',
        `COALESCE(visit_visitor.fotos, '[]'::json) as photos`,
      ])
      .from(VisitorEntity, 'visitor')
      .leftJoin(
        VisitVisitorEntity,
        'visit_visitor',
        'visitor.id = visit_visitor.id_visitante'
      )
      .where('visit.id = visit_visitor.id_visita')
      .andWhere('visitor.estado = true')
      .groupBy('visitor.id')
      .addGroupBy('visit_visitor.id')
      .orderBy('visitor.id', 'ASC')
      .getQuery();

    const query = cnx
      .createQueryBuilder()
      .select([
        'visit.id as id',
        'visit.fecha_inicio as "startDate"',
        'visit.fecha_fin as "endDate"',
        'visit.horas_validez as "validityHours"',
        'visit.motivo as reason',
        `CONCAT(person.names, ' ', person.surnames) as "generatedBy"`,
        'visit.estado as status',
        'visit.id_residencia as "idResidency"',
        'residency.manzana as block',
        'residency.villa as town',
        'residency.urbanizacion as urbanization',
        'visit.tipo as type',
      ])
      .addSelect([
        `
        (
          SELECT COALESCE(json_agg(row_to_json(item)), '[]'::json)
          FROM (${visitorQuery}) item
        ) AS "visitors"
      `,
      ])
      .from(VisitEntity, 'visit')
      .leftJoin(ResidencyEntity, 'residency', 'visit.id_residencia = residency.id')
      .leftJoin(PersonEntity, 'person', 'residency.id_persona = person.id')
      .where('visit.id = :id', { id })
      .orderBy('visit.id', 'ASC');

    return query.getRawOne<VisitI>();
  }

  getInRange(cnx: EntityManager) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'visit.id as id',
        'visit.tipo as type',
        'visit.fecha_inicio as "startDate"',
        'visit.horas_validez as "validityHours"',
        'visit.estado as status',
      ])
      .from(VisitEntity, 'visit')
      .where('visit.estado = :pending', {
        pending: VisitStatusEnum.PENDING,
      })
      .orWhere('visit.estado = :inProgress', {
        inProgress: VisitStatusEnum.IN_PROGRESS,
      });

    return query.getRawMany<VisitInRangeI>();
  }

  getValidVisit(
    cnx: EntityManager,
    id: number,
    residencyId: number
  ) {
    return cnx.findOne(VisitEntity, {
      where: { id, residencyId },
    });
  }

  create(cnx: EntityManager, payload: VisitEntity) {
    const insert = cnx.create(VisitEntity, payload);
    return cnx.save(insert);
  }

  async update(
    cnx: EntityManager,
    id: number,
    payload: VisitEntity
  ) {
    const update = await cnx.update(
      VisitEntity,
      { id },
      payload
    );

    return update.affected;
  }
}
