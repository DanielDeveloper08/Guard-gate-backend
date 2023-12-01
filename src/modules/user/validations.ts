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
}
