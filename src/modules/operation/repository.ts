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

  async update(cnx: EntityManager, id: number, payload: OperationEntity) {
    const update = await cnx.update(
      OperationEntity,
      { id },
      payload
    );

    return update.affected;
  }

  async disableOperations(cnx: EntityManager, operationsIdxs: number[]) {
    const update = await cnx
      .createQueryBuilder()
      .update(OperationEntity)
      .set({
        status: false,
        updatedAt: new Date(),
      })
      .where('id NOT IN (:...idxs)', { idxs: operationsIdxs })
      .andWhere('estado = true')
      .execute();

    return update.affected;
  }

  async resetOperations(cnx: EntityManager, operationsIdxs: number[]) {
    const update = await cnx
      .createQueryBuilder()
      .update(OperationEntity)
      .set({
        status: false,
        updatedAt: new Date(),
      })
      .where('id IN(:...idxs)', { idxs: operationsIdxs })
      .andWhere('estado = true')
      .execute();

    return update.affected;
  }
}
