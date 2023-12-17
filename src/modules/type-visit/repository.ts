import { EntityManager } from 'typeorm';
import { TypeVisitEntity } from '../../database';
import { VisitTypeEnum } from '../../enums/visit.enum';

export class TypeVisitRepository {

  getByName(cnx: EntityManager, name: VisitTypeEnum) {
    return cnx.findOne(
      TypeVisitEntity,
      { where: { name } }
    );
  }

  create(cnx: EntityManager, payload: TypeVisitEntity) {
    const insert = cnx.create(TypeVisitEntity, payload);
    return cnx.save(insert);
  }
}
