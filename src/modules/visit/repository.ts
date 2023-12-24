import { EntityManager } from 'typeorm';
import {
  TypeVisitEntity,
  VisitEntity,
  VisitVisitorEntity,
  VisitorEntity,
} from '../../database';
import { VisitI } from '../../interfaces/visit.interface';

export class VisitRepository {
  create(cnx: EntityManager, payload: VisitEntity) {
    const insert = cnx.create(VisitEntity, payload);
    return cnx.save(insert);
  }

  getById(cnx: EntityManager, id: number) {

    const visitorQuery = cnx
      .createQueryBuilder()
      .select([
        'visitor.id as id',
        'visitor.nombres as names',
        'visitor.apellidos as surnames',
        'visitor.cedula as "docNumber"',
        'visitor.id_residencia as "idResidency"',
      ])
      .from(VisitorEntity, 'visitor')
      .leftJoin(
        VisitVisitorEntity,
        'visit_visitor',
        'visitor.id = visit_visitor.id_visitante'
      )
      .where('visit.id = visit_visitor.id_visita')
      .groupBy('visitor.id')
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
        'type.name as type',
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
      .leftJoin(TypeVisitEntity, 'type', 'visit.id_tipo_visita = type.id')
      .where('visit.id = :id', { id })
      .orderBy('visit.id', 'ASC');

    return query.getRawOne<VisitI>();
  }
}
