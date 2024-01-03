import { Request, Response } from 'express';
import { VisitorService } from './service';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { PaginationI } from '../../interfaces/global.interface';
import { HttpCodes } from '../../enums/http-codes.enum';
import {
  VisitorDTO,
  VisitorUpdateDTO,
} from '../../interfaces/visitor.interface';

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

  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this._visitorSrv.getOne(this._cnx, Number(id));

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

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payload = req.body as VisitorUpdateDTO;
      const data = await this._visitorSrv.update(
        this._cnx,
        Number(id),
        payload
      );

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

  disable = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this._visitorSrv.disable(this._cnx, Number(id));

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
