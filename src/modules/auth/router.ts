import { BaseRouter } from '../../shared/base-router';
import { AuthController } from './controller';
import { AuthValidations } from './validations';

export class AuthRouter extends BaseRouter<AuthController, AuthValidations> {

  constructor() {
    super(AuthController, AuthValidations);
  }

  initializeRoutes(): void {
    this.router.post(
      '/auth/login',
      [
        this.validation!.login()
      ],
      this.controller.login
    );

    this.router.post(
      '/auth/validate-login',
      [
        this.validation!.validateLogin()
      ],
      this.controller.validateLogin
    );

    this.router.post(
      '/auth/register',
      [
        this.validation!.register()
      ],
      this.controller.register
    );
  }
}
