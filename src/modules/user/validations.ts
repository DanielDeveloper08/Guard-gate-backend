import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class UserValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  setMainResidency = () => {
    const setMainResidencySchema: schema = {
      query: Joi.object({
        residencyId: this._validations.validNumber('residencyId'),
      }),
    };

    return validate(setMainResidencySchema);
  };

  getUserById = () => {
    const schema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
    };

    return validate(schema);
  };
}
