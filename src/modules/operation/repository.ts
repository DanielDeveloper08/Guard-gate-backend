import { EntityManager } from 'typeorm';
import { OperationEntity } from '../../database';

export class OperationRepository {

  getById(cnx: EntityManager, id: number) {
    return cnx.findOne(OperationEntity, {
      where: { id },
    });
  }

  getAll(cnx: EntityManager) {
    return cnx.find(OperationEntity);
  }
}
