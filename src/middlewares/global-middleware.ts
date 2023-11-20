import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validation';
import { ServiceResponse } from '../helpers/service-response';
import { ERR_400 } from '../shared/messages';

export class GlobalMiddleware {
  constructor() {}

  static validateJwtToken = () => {};

  static wrapValidations = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (error instanceof ValidationError) {
      const message = Object.values(error.details)
        .reduce((prev, acc) => {
          prev.push(...acc.map((i: any) => i.message));
          return prev;
        }, [])
        .join(' ');

      return ServiceResponse.fail({
        res,
        error: message,
      });
    }

    return ServiceResponse.fail({
      res,
      error: ERR_400,
    });
  };
}
