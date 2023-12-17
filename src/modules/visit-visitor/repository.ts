import { EntityManager } from 'typeorm';
import { VisitVisitorEntity } from '../../database';

export class VisitVisitorRepository {

  create(cnx: EntityManager, payload: Array<VisitVisitorEntity>) {
    const insert = cnx.create(VisitVisitorEntity, payload);
    return cnx.save(insert);
  }
}
