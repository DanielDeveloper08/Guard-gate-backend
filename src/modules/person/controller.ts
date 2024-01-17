import { Request, Response } from 'express';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { PersonService } from './service';
import { PaginationI } from '../../interfaces/global.interface';

export class PersonController {

  constructor(
    private readonly _personSrv = new PersonService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const payload = req.query as PaginationI;
      const data = await this._personSrv.getAll(this._cnx, payload);

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
