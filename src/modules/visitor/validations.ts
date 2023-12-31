import { schema, Joi, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class VisitorValidations {

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
        names: this._validations.validString('names', 255),
        surnames: this._validations.validString('surnames', 255),
        docNumber: this._validations.validString('docNumber', 255),
        phone: this._validations.validString('phone', 255),
      }),
    };

    return validate(createSchema);
  };
}
