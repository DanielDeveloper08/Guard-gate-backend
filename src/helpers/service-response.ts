import _ from 'lodash';
import { HttpCodes } from '../enums/http-codes.enum';
import {
  ResponseFailI,
  ResponseSuccessI,
  ServiceResponseI,
} from '../interfaces/service-response.interface';
import { OK_200 } from '../shared/messages';

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

    const response: ServiceResponseI = {
      statusCode,
      message: _.isObject(payload.error)
        ? (payload.error as any).message
        : payload.error,
      data: null,
    };

    return payload.res.status(statusCode).send({ ...response });
  }
}
