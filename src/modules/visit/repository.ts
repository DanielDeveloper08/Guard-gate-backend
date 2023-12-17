import { EntityManager } from 'typeorm';
import { VisitEntity } from '../../database';

export class VisitRepository {

  create(cnx: EntityManager, payload: VisitEntity) {
    const insert = cnx.create(VisitEntity, payload);
    return cnx.save(insert);
  }
}
