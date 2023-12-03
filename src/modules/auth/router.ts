import { BaseRouter } from '../../shared/base-router';
import { AuthController } from './controller';
import { AuthValidations } from './validations';

export class AuthRouter extends BaseRouter<AuthController, AuthValidations> {

  constructor() {
    super(AuthController, AuthValidations);
  }

  initRoutes(): void {
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

    this.router.post(
      '/auth/recover-password',
      [
        this.validation!.recoverPassword()
      ],
      this.controller.recoverPassword
    );

    this.router.post(
      '/auth/validate-otp',
      [
        this.validation!.validateLogin()
      ],
      this.controller.validateOtp
    );

    this.router.post(
      '/auth/reset-password',
      [
        this.validation!.resetPassword()
      ],
      this.controller.resetPassword
    );
  }
}
