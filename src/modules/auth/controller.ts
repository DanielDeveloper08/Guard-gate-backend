import { Request, Response } from 'express';
import { AuthService } from './service';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers/service-response';
import {
  LoginPayloadI,
  RecoverPasswordI,
  RegisterPayloadI,
  ResetPasswordI,
  UpdatePayloadI,
  ValidateLoginI,
} from '../../interfaces/auth.interface';

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

  validateLogin = async (req: Request, res: Response) => {
    try {
      const payload = req.body as ValidateLoginI;
      const data = await this._authSrv.validateLogin(this._cnx, payload);

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

  updateUser = async (req: Request, res: Response) => {
    try {
      const payload = req.body as UpdatePayloadI;
      const data = await this._authSrv.updateUser(this._cnx, payload);

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

  recoverPassword = async (req: Request, res: Response) => {
    try {
      const payload = req.body as RecoverPasswordI;
      const data = await this._authSrv.recoverPassword(this._cnx, payload);

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

  validateOtp = async (req: Request, res: Response) => {
    try {
      const payload = req.body as ValidateLoginI;
      const data = await this._authSrv.validateOtp(this._cnx, payload);

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

  resetPassword = async (req: Request, res: Response) => {
    try {
      const payload = req.body as ResetPasswordI;
      const data = await this._authSrv.resetPassword(this._cnx, payload);

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
