import { Request, Response } from 'express';
import { AuthService } from './service';
import { EntityManager } from 'typeorm';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers/service-response';
import { LoginPayloadI, RegisterPayloadI } from '../../interfaces/auth.interface';

export class AuthController {

  constructor(
    private readonly _authSrv = new AuthService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  login = async (req: Request, res: Response) => {
    try {
      const payload = req.body as LoginPayloadI;
      const data = await this._authSrv.login(this._cnx, payload);

      return ServiceResponse.success({
        res,
        data,
      });
    } catch (error) {
      return ServiceResponse.fail({
        res,
        error,
      });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const payload = req.body as RegisterPayloadI;
      const data = await this._authSrv.register(this._cnx, payload);

      return ServiceResponse.success({
        res,
        data,
      });
    } catch (error) {
      return ServiceResponse.fail({
        res,
        error,
      });
    }
  };
}
