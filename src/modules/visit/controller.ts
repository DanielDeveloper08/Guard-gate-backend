import { Request, Response } from 'express';
import { AppDataSource } from '../../database';
import { HttpCodes } from '../../enums/http-codes.enum';
import { ServiceResponse } from '../../helpers';
import { VisitDTO } from '../../interfaces/visit.interface';
import { VisitService } from './service';

export class VisitController {

  constructor(
    private readonly _visitSrv = new VisitService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const payload = req.body as VisitDTO;
      const data = await this._visitSrv.create(this._cnx, payload);

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
