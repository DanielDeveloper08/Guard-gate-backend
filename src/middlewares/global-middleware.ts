import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validation';
import { ServiceResponse, JwtHelper } from '../helpers';
import { ERR_400, ERR_401, TOKEN_INVALID } from '../shared/messages';
import { HttpCodes } from '../enums/http-codes.enum';

export class GlobalMiddleware {

  static validateJwtToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.header('Authorization')?.split(' ').at(1);

    if (!token) {
      return ServiceResponse.fail({
        res,
        error: ERR_401,
        statusCode: HttpCodes.UNAUTHORIZED,
      });
    }

    const jwtHelper = new JwtHelper();
    const tokenPayload = jwtHelper.validate(token);

    if (!tokenPayload) {
      return ServiceResponse.fail({
        res,
        error: TOKEN_INVALID,
        statusCode: HttpCodes.UNAUTHORIZED,
      });
    }

    global.token = token;
    global.user = tokenPayload.data;

    return next();
  };

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
