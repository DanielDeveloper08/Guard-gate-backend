import { schema, Joi, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';
import { VisitTypeEnum } from '../../enums/visit.enum';

export class VisitValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  create = () => {
    const typeOptions = [
      VisitTypeEnum.QR,
      VisitTypeEnum.PREAUTHORIZED,
    ];

    const createSchema: schema = {
      body: Joi.object({
        startDate: this._validations.validString('startDate', 255),
        validityHours: this._validations.validNumber('validityHours'),
        listVisitors: this._validations.validArrayNumber('listVisitors'),
        type: this._validations.validOptions(
          'type',
          typeOptions,
          typeOptions.join(' - ')
        ),
      }),
    };

    return validate(createSchema);
  };

  getById = () => {
    const getOneSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
    };

    return validate(getOneSchema);
  };
}
