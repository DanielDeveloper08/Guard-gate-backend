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
        block: this._validations.validString('block', 255),
        town: this._validations.validString('town', 255),
        personId: this._validations.validNumber('personId'),
      }),
    };

    return validate(createSchema);
  };

  upsertMany = () => {
    const createSchema: schema = {
      body: Joi.object({
        personId:Joi.number().required(),
        residences:Joi.array().items(
          Joi.object({
            id:Joi.number().required(),
            block: this._validations.validString('block', 255),
            town: this._validations.validString('town', 255),
            isMain:Joi.bool().required(),
          }),
        )
      })
    };

    return validate(createSchema);
  };

  update = () => {
    const updateSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
      body: Joi.object({
        block: this._validations.validString('block', 255),
        town: this._validations.validString('town', 255),
        personId: this._validations.validNumber('personId'),
      }),
    };

    return validate(updateSchema);
  };

  remove = () => {
    const removeSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
    };

    return validate(removeSchema);
  };
}
