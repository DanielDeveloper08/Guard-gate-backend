import { Request, Response } from 'express';
import { UrbanizationService } from './service';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { HttpCodes } from '../../enums/http-codes.enum';
import { UrbanizationDTO } from '../../interfaces/urbanization.interface';

export class UrbanizationController {

  constructor(
    private readonly _urbanizationSrv = new UrbanizationService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this._urbanizationSrv.getOne(this._cnx, Number(id));

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
      const payload = req.body as UrbanizationDTO;
      const data = await this._urbanizationSrv.create(this._cnx, payload);

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
      const payload = req.body as UrbanizationDTO;
      const data = await this._urbanizationSrv.update(this._cnx, Number(id), payload);

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
