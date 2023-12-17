import { Request, Response } from 'express';
import { VisitorService } from './service';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { PaginationI } from '../../interfaces/global.interface';
import { VisitorDTO } from '../../interfaces/visitor.interface';
import { HttpCodes } from '../../enums/http-codes.enum';

export class VisitorController {

  constructor(
    private readonly _visitorSrv = new VisitorService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const payload = req.query as PaginationI;
      const data = await this._visitorSrv.getAll(this._cnx, payload);

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

  create = async (req: Request, res: Response) => {
    try {
      const payload = req.body as VisitorDTO;
      const data = await this._visitorSrv.create(this._cnx, payload);

      return ServiceResponse.success({
        res,
        data,
        statusCode: HttpCodes.CREATED,
      });
    } catch (error) {
      return ServiceResponse.fail({
        res,
        error,
      });
    }
  };
}
