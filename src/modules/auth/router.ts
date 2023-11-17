import { BaseRouter } from '../../shared/base-router';
import { AuthController } from './controller';

export class AuthRouter extends BaseRouter<AuthController> {
  constructor() {
    super(AuthController);
  }

  initializeRoutes(): void {
    this.router.get('/auth', (_req, res) => {
      res.json({
        message: 'Auth Router',
      });
    });
  }
}
