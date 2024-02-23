import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class UrbanizationValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  getOne = () => {
    const getOneSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
    };

    return validate(getOneSchema);
  };

  create = () => {
    const createSchema: schema = {
      body: Joi.object({
        name: this._validations.validString('name', 255),
        address: this._validations.validString('address', 255),
      }),
    };

    return validate(createSchema);
  };

  update = () => {
    const updateSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
      body: Joi.object({
        name: this._validations.validString('name', 255),
        address: this._validations.validString('address', 255),
      }),
    };

    return validate(updateSchema);
  };
}
