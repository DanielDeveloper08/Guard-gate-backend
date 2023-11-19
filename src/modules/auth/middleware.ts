import { Joi, schema, validate } from 'express-validation';
import { GlobalValidations } from '../../shared/global-validations';
import { GlobalMiddleware } from '../../middlewares/global-middleware';

export class AuthMiddleware {

  constructor(
    private readonly _validations = new GlobalValidations(),
  ) {}

  loginMdw = () => {
    const loginSchema: schema = {
      body: Joi.object({
        usuario: this._validations.validString('usuario', 255),
        contrasenia: this._validations.validString('contrasenia', 255),
      }),
    };

    return [
      // GlobalMiddleware.validateJwtToken,
      validate(loginSchema),
    ];
  };
}
