import { HttpCodes } from '../enums/http-codes.enum';
import {
  ResponseFailI,
  ResponseSuccessI,
  ServiceResponseI,
} from '../interfaces/service-response.interface';
import { ERR_400, OK_200 } from '../shared/messages';
import { ServiceException } from '../shared/service-exception';

export class ServiceResponse {

  static success(payload: ResponseSuccessI) {
    const statusCode = payload.statusCode ?? HttpCodes.OK;

    const response: ServiceResponseI = {
      statusCode,
      message: OK_200,
      data: payload.data,
    };

    return payload.res.status(statusCode).send({ ...response });
  }

  static fail(payload: ResponseFailI) {
    const statusCode = payload.statusCode ?? HttpCodes.BAD_REQUEST;

    const message =
      payload.error instanceof ServiceException
        ? payload.error.message
        : payload.error instanceof Error
        ? ERR_400
        : (payload.error as string);

    const response: ServiceResponseI = {
      statusCode,
      message,
      data: null,
    };

    return payload.res.status(statusCode).send({ ...response });
  }
}
