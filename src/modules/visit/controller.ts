import { Request, Response } from 'express';
import { AppDataSource } from '../../database';
import { HttpCodes } from '../../enums/http-codes.enum';
import { ServiceResponse } from '../../helpers';
import { VisitDTO, SaveVisitDetailI } from '../../interfaces/visit.interface';
import { VisitService } from './service';
import { PaginationI } from '../../interfaces/global.interface';

export class VisitController {

  constructor(
    private readonly _visitSrv = new VisitService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const payload = req.query as PaginationI;
      const data = await this._visitSrv.getAll(this._cnx, payload);

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

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this._visitSrv.getById(this._cnx, Number(id));

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

  saveDetail = async (req: Request, res: Response) => {
    try {
      const payload = req.body as SaveVisitDetailI;
      const data = await this._visitSrv.saveDetail(this._cnx, payload);

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
