import { BaseRouter } from '../../shared/base-router';
import { AuthController } from './controller';
import { AuthMiddleware } from './middleware';

export class AuthRouter extends BaseRouter<AuthController, AuthMiddleware> {
  constructor() {
    super(AuthController, AuthMiddleware);
  }

  initializeRoutes(): void {
    this.router.post(
      '/auth/login',
      this.middleware!.loginMdw(),
      this.controller.login
    );

    this.router.post(
      '/auth/register',
      this.middleware!.loginMdw(),
      this.controller.register
    );
  }
}
