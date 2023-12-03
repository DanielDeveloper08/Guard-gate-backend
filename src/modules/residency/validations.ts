import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class ResidencyValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  getAll = () => {
    const getAllSchema: schema = {
      query: Joi.object({
        page: this._validations.validNumberNoRequired('page'),
        limit: this._validations.validNumberNoRequired('limit'),
        search: this._validations.validStringNoRequired('search', 255),
      }),
    };

    return validate(getAllSchema);
  };

  create = () => {
    const createSchema: schema = {
      body: Joi.object({
        block: this._validations.validString('block', 255),
        town: this._validations.validString('town', 255),
        urbanization: this._validations.validString('urbanization', 255),
        personId: this._validations.validNumber('personId'),
      }),
    };

    return validate(createSchema);
  };
}
