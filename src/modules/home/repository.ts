import { EntityManager } from 'typeorm';
import {
  VisitorEntity,
  VisitVisitorEntity,
  VisitEntity,
  ResidencyEntity,
  PersonEntity,
} from '../../database';
import { VisitI } from '../../interfaces/visit.interface';
import { VisitStatusEnum } from '../../enums/visit.enum';
import { VisitorI } from '../../interfaces/visitor.interface';

export class HomeRepository {

  getLastVisits(
    cnx: EntityManager,
    mainResidencyId: number,
    limit?: string,
    pending?: boolean
  ) {
    const limitValue = Number(limit ?? 5);

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
      .leftJoin(
        ResidencyEntity,
        'residency',
        'visit.id_residencia = residency.id'
      )
      .leftJoin(PersonEntity, 'person', 'residency.id_persona = person.id')
      .where('visit.id_residencia = :mainResidencyId', {
        mainResidencyId,
      })
      .andWhere('visit.estado IN(:...status)', {
        status: pending
          ? [VisitStatusEnum.PENDING, VisitStatusEnum.IN_PROGRESS]
          : [VisitStatusEnum.FULFILLED],
      })
      .orderBy('visit.id', 'DESC')
      .limit(limitValue);

    return query.getRawMany<VisitI>();
  }

  getFrequentVisitors(
    cnx: EntityManager,
    mainResidencyId: number,
    limit?: string
  ) {
    const limitValue = Number(limit ?? 5);

    const query = cnx
      .createQueryBuilder()
      .select([
        'visitor.id as id',
        'visitor.nombres as names',
        'visitor.apellidos as surnames',
        'visitor.cedula as "docNumber"',
        'visitor.id_residencia as "idResidency"',
        'visitor.estado as status',
        `COUNT(visit_visitor.id_visitante)::INTEGER as frequency`,
      ])
      .from(VisitorEntity, 'visitor')
      .leftJoin(
        VisitVisitorEntity,
        'visit_visitor',
        'visitor.id = visit_visitor.id_visitante'
      )
      .where('visitor.id_residencia = :mainResidencyId', { mainResidencyId })
      .andWhere('visitor.estado = true')
      .groupBy('visitor.id')
      .limit(limitValue);

    return query.getRawMany<VisitorI>();
  }
}
