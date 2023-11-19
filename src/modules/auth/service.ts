import { EntityManager } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserEntity } from '../../database';
import { UserRepository } from '../user/repository';
import { JwtHelper } from '../../helpers/jwt-helper';
import {
  LoginPayloadI,
  RegisterPayloadI,
} from '../../interfaces/auth.interface';
import {
  LOGIN_FAIL,
  RECORD_CREATED_FAIL,
  UNREGISTERED_USER,
  USER_REGISTERED,
} from '../../shared/messages';

export class AuthService {

  constructor(
    private readonly repo = new UserRepository(),
    private readonly jwtHelper = new JwtHelper(),
  ) {}

  async login(cnx: EntityManager, payload: LoginPayloadI) {
    const user = await this.repo.getByUser(cnx, payload.usuario);

    if (!user) throw UNREGISTERED_USER;

    const isMatch = await bcrypt.compare(
      payload.contrasenia,
      user.password
    );

    if (!isMatch) throw LOGIN_FAIL;

    const userData = {
      id: user.id,
      usuario: user.user,
    };

    const token = this.jwtHelper.create(userData);

    return {
      token,
      user: userData,
    };
  }

  async register(cnx: EntityManager, payload: RegisterPayloadI) {
    const existsUser = await this.repo.getByUser(cnx, payload.usuario);

    if (existsUser) throw USER_REGISTERED;

    const passwordHashed = await bcrypt.hash(
      payload.contrasenia,
      bcrypt.genSaltSync(12)
    );

    const userPayload = {
      user: payload.usuario,
      password: passwordHashed,
    } as UserEntity;

    const userCreated = await this.repo.create(cnx, userPayload);

    if (!userCreated) return RECORD_CREATED_FAIL(`usuario: ${payload.usuario}`);

    const userData = {
      id: userCreated.id,
      usuario: userCreated.user,
    };

    const token = this.jwtHelper.create(userData);

    return {
      token,
      user: userData,
    };
  }
}
