import { EntityManager } from 'typeorm';
import { VisitVisitorEntity } from '../../database';

export class VisitVisitorRepository {

  create(cnx: EntityManager, payload: VisitVisitorEntity) {
    const insert = cnx.create(VisitVisitorEntity, payload);
    return cnx.save(insert);
  }

  createMany(cnx: EntityManager, payload: Array<VisitVisitorEntity>) {
    const insert = cnx.create(VisitVisitorEntity, payload);
    return cnx.save(insert);
  }

  async update(
    cnx: EntityManager,
    id: number,
    payload: VisitVisitorEntity
  ) {
    const update = await cnx.update(
      VisitVisitorEntity,
      { id },
      payload
    );

    return update.affected;
  }

  getVisitVisitor(cnx: EntityManager, visitId: number, visitorId: number) {
    return cnx.findOne(VisitVisitorEntity, {
      where: { visitId, visitorId },
    });
  }
}
