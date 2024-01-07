import { Request, Response } from 'express';
import { AppDataSource } from '../../database';
import { ServiceResponse } from '../../helpers';
import { RoleService } from './service';
import { PaginationI } from '../../interfaces/global.interface';
import { UpdateRoleDTO } from '../../interfaces/role.interface';
import { RoleTypeEnum } from '../../enums/role.enum';

export class RoleController {

  constructor(
    private readonly _roleSrv = new RoleService(),
    private readonly _cnx = AppDataSource.getInstance().cnx
  ) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const payload = req.query as PaginationI;
      const data = await this._roleSrv.getAll(this._cnx, payload);

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

  getRoleByName = async (req: Request, res: Response) => {
    try {
      const payload = req.query.rolename as RoleTypeEnum;
      const data = await this._roleSrv.getRoleByName(this._cnx, payload);

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

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payload = req.body as UpdateRoleDTO;
      const data = await this._roleSrv.update(this._cnx, Number(id), payload);

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
