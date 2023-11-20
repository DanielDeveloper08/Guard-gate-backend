import { EntityManager } from 'typeorm';
import { TokenOtpEntity } from '../../database';

export class TokenOtpRepository {

  create(cnx: EntityManager, payload: TokenOtpEntity) {
    const insert = cnx.create(TokenOtpEntity, payload);
    return cnx.save(insert);
  }

  getValidCode(
    cnx: EntityManager,
    userId: number,
    code: string
  ) {
    return cnx.findOne(
      TokenOtpEntity,
      { where: { userId, code, status: true } },
    );
  }

  async setUsed(cnx: EntityManager, id: number) {
    const update = await cnx.update(
      TokenOtpEntity,
      { id },
      {
        used: true,
        status: false,
        updatedAt: new Date(),
      }
    );

    return update.affected;
  }
}
