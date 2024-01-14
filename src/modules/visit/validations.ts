import { schema, Joi, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';
import { VisitTypeEnum } from '../../enums/visit.enum';

export class VisitValidations {

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

  getById = () => {
    const getOneSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
    };

    return validate(getOneSchema);
  };

  create = () => {
    const typeOptions = [
      VisitTypeEnum.QR,
      VisitTypeEnum.PREAUTHORIZED,
    ];

    const createSchema: schema = {
      body: Joi.object({
        startDate: this._validations.validString('startDate', 255),
        validityHours: this._validations.validNumber('validityHours'),
        reason: this._validations.validStringNoRequired('reason', 255),
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

  saveDetail = () => {
    const saveDetailSchema: schema = {
      body: Joi.object({
        visitId: this._validations.validNumber('visitId'),
        visitorId: this._validations.validNumber('visitorId'),
        observation: this._validations.validStringNoRequired('observation', 255),
        carPlate: this._validations.validStringNoRequired('carPlate', 255),
        hasEntered: this._validations.validBoolean('hasEntered'),
        photos: this._validations.validArrayStr('photos'),
      }),
    };

    return validate(saveDetailSchema);
  };

  sendNotification = () => {
    const sendNotificationSchema: schema = {
      body: Joi.object({
        visitId: this._validations.validNumber('visitId'),
        imgUrl: this._validations.validStringNoMaxLength('imgUrl'),
      }),
    };

    return validate(sendNotificationSchema);
  };

  cancel = () => {
    const cancelSchema: schema = {
      params: Joi.object({
        id: this._validations.validNumber('id'),
      }),
    };

    return validate(cancelSchema);
  };
}
