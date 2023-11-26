import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';

export class AuthValidations {

  constructor(
    private readonly _validations = new GlobalValidations()
  ) {}

  login = () => {
    const loginSchema: schema = {
      body: Joi.object({
        usuario: this._validations.validString('usuario', 255),
        contrasenia: this._validations.validString('contrasenia', 255),
      }),
    };

    return validate(loginSchema);
  };

  validateLogin = () => {
    const validateLoginSchema: schema = {
      body: Joi.object({
        usuario: this._validations.validString('usuario', 255),
        codigo: this._validations.validString('codigo', 8),
      }),
    };

    return validate(validateLoginSchema);
  };

  register = () => {
    const registerSchema: schema = {
      body: Joi.object({
        usuario: this._validations.validString('usuario', 255),
        contrasenia: this._validations.validString('contrasenia', 255),
        nombres: this._validations.validString('nombres', 255),
        apellidos: this._validations.validString('apellidos', 255),
        correo: this._validations.validString('correo', 255),
        telefono: this._validations.validStringNoRequired('telefono', 255),
      }),
    };

    return validate(registerSchema);
  };

  recoverPassword = () => {
    const recoverPasswordSchema: schema = {
      body: Joi.object({
        usuario: this._validations.validString('usuario', 255),
      }),
    };

    return validate(recoverPasswordSchema);
  };

  resetPassword = () => {
    const resetPasswordSchema: schema = {
      body: Joi.object({
        usuario: this._validations.validString('usuario', 255),
        nueva_contrasenia: this._validations.validString('nueva_contrasenia', 255),
      }),
    };

    return validate(resetPasswordSchema);
  };
}
