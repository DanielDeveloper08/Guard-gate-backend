import { EntityManager } from 'typeorm';
import { VisitStatusEntity } from '../../database';
import { VisitStatusEnum } from '../../enums/visit.enum';

export class VisitStatusRepository {

  getByName(cnx: EntityManager, name: VisitStatusEnum) {
    return cnx.findOne(
      VisitStatusEntity,
      { where: { name } }
    );
  }

  create(cnx: EntityManager, payload: VisitStatusEntity) {
    const insert = cnx.create(VisitStatusEntity, payload);
    return cnx.save(insert);
  }
}
