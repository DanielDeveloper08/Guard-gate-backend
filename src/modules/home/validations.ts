import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class HomeValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  getVisitData = () => {
    const getVisitDataSchema: schema = {
      query: Joi.object({
        limit: this._validations.validNumberNoRequired('limit'),
        frequency: this._validations.validNumberNoRequired('frequency'),
      }),
    };

    return validate(getVisitDataSchema);
  };
}
