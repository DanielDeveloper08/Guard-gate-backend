import { EntityManager } from 'typeorm';
import { UserEntity } from '../../database';
import { UserRepository } from './repository';

export class UserService {

  constructor(
    private readonly _repo = new UserRepository()
  ) {}

  getAll(cnx: EntityManager): Promise<UserEntity[]> {
    return this._repo.getAll(cnx);
  }

  async getByUser(
    cnx: EntityManager,
    user: string
  ): Promise<UserEntity | undefined> {
    const userFound = await this._repo.getByUser(cnx, user);

    if (userFound !== null) {
      return userFound;
    }
  }
}
