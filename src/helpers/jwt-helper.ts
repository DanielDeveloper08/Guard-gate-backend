import * as jwt from 'jsonwebtoken';
import { Environments } from '../config/environments';
import {
  UserTokenPayloadI,
  UserTokenDecodeI,
} from '../interfaces/auth.interface';

export class JwtHelper extends Environments {
  private readonly _jwtKey: string;
  private readonly _expired: string;

  constructor() {
    super();
    this._jwtKey = this.getEnv('JWT_SECRET_KEY')!;
    this._expired = this.getEnv('TIME_JWT') ?? '7d';
  }

  public create(payload: UserTokenPayloadI): string {
    return jwt.sign({ data: { ...payload } }, this._jwtKey, {
      expiresIn: this._expired,
      algorithm: 'HS512',
    });
  }

  public validate(token: string): UserTokenDecodeI | null {
    try {
      return jwt.verify(token, this._jwtKey) as UserTokenDecodeI;
    } catch (_) {
      return null;
    }
  }
}
