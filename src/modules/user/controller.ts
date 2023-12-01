import { Request, Response } from 'express';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { UserService } from './service';

export class UserController {

  constructor(
    private readonly _userSrv = new UserService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getResidencesByUserId = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const data = await this._userSrv.getResidencesByUserId(this._cnx, userId);

      return ServiceResponse.success({
        res,
        data,
      });
    } catch (error) {
      console.error(error);
      return ServiceResponse.fail({
        res,
        error,
      });
    }
  };
}
