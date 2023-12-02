import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class UserValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  getById = () => {
    const getByIdSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
    };

    return validate(getByIdSchema);
  };

  setMainResidency = () => {
    const setMainResidencySchema: schema = {
      body: Joi.object({
        idUsuario: this._validations.validNumber('idUsuario'),
        idResidencia: this._validations.validNumber('idResidencia'),
      }),
    };

    return validate(setMainResidencySchema);
  };
}
