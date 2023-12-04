import { Request, Response } from 'express';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { ResidencyService } from './service';
import { ResidencyDTO } from '../../interfaces/residency.interface';
import { HttpCodes } from '../../enums/http-codes.enum';

export class ResidencyController {

  constructor(
    private readonly _residencySrv = new ResidencyService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const payload = req.query;
      const data = await this._residencySrv.getAll(this._cnx, payload);

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
      const data = await this._residencySrv.getOne(this._cnx, Number(id));

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
      const payload = req.body as ResidencyDTO;
      const data = await this._residencySrv.create(this._cnx, payload);

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
      const payload = req.body as ResidencyDTO;
      const data = await this._residencySrv.update(
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

  remove = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this._residencySrv.remove(this._cnx, Number(id));

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
