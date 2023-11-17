import * as jwt from 'jsonwebtoken';

export class JwtHelper {
  private _expired: string;
  private _jwtKey: string;

  constructor() {
    this._expired = process.env.TIME_JWT ?? '';
    this._jwtKey = process.env.JWT_KEY ?? '';
  }

  public create(payload: object): string {
    return jwt.sign({ data: { ...payload } }, this._jwtKey, {
      expiresIn: this._expired,
    });
  }

  public validate(token: string): unknown | null {
    try {
      return jwt.verify(token, this._jwtKey);
    } catch (error) {
      return null;
    }
  }
}
