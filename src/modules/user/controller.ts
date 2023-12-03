import { Request, Response } from 'express';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { UserService } from './service';
import { MainResidencyPayloadI } from '../../interfaces/user.interface';

export class UserController {

  constructor(
    private readonly _userSrv = new UserService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getResidencesByUserId = async (req: Request, res: Response) => {
    try {
      const data = await this._userSrv.getResidencesByUserId(this._cnx);

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

  setMainResidency = async (req: Request, res: Response) => {
    try {
      const residencyId = Number(req.query.residencyId);
      const data = await this._userSrv.setMainResidency(this._cnx, residencyId);

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
