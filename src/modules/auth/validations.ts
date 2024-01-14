import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class AuthValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  login = () => {
    const loginSchema: schema = {
      body: Joi.object({
        username: this._validations.validString('username', 255),
        password: this._validations.validString('password', 255),
      }),
    };

    return validate(loginSchema);
  };

  validateLogin = () => {
    const validateLoginSchema: schema = {
      body: Joi.object({
        username: this._validations.validString('username', 255),
        code: this._validations.validString('code', 8),
      }),
    };

    return validate(validateLoginSchema);
  };

  register = () => {
    const registerSchema: schema = {
      body: Joi.object({
        username: this._validations.validString('username', 255),
        password: this._validations.validString('password', 255),
        names: this._validations.validString('names', 255),
        surnames: this._validations.validString('surnames', 255),
        email: this._validations.validString('email', 255),
        phone: this._validations.validStringNoRequired('phone', 255),
        roleId: Joi.number().required(),
      }),
    };

    return validate(registerSchema);
  };

  updateUser = () => {
    const registerSchema: schema = {
      body: Joi.object({
        id: Joi.number().required(),
        username: this._validations.validString('username', 255),
        names: this._validations.validString('names', 255),
        surnames: this._validations.validString('surnames', 255),
        email: this._validations.validString('email', 255),
        phone: this._validations.validStringNoRequired('phone', 255),
        roleId: Joi.number().required(),
      }),
    };

    return validate(registerSchema);
  };

  recoverPassword = () => {
    const recoverPasswordSchema: schema = {
      body: Joi.object({
        username: this._validations.validString('username', 255),
      }),
    };

    return validate(recoverPasswordSchema);
  };

  resetPassword = () => {
    const resetPasswordSchema: schema = {
      body: Joi.object({
        username: this._validations.validString('username', 255),
        newPassword: this._validations.validString('newPassword', 255),
      }),
    };

    return validate(resetPasswordSchema);
  };
}
