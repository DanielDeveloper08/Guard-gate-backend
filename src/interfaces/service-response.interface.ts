import { type Response } from 'express';
import { HttpCodes } from '../enums/http-codes.enum';
import { ServiceException } from '../shared/service-exception';

export interface ServiceResponseI {
  statusCode: HttpCodes;
  message: string;
  data: unknown;
  token?: string;
}

export interface ResponseSuccessI {
  statusCode?: HttpCodes;
  res: Response;
  data: unknown;
}

export interface ResponseFailI extends Omit<ResponseSuccessI, 'data'> {
  error: unknown | Error | ServiceException;
}
