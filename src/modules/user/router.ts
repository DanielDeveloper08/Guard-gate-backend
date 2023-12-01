import { BaseRouter } from '../../shared/base-router';
import { UserController } from './controller';
import { UserValidations } from './validations';
import { GlobalMiddleware } from '../../middlewares/global-middleware';

export class UserRouter extends BaseRouter<UserController, UserValidations> {

  constructor() {
    super(UserController, UserValidations);
  }

  initializeRoutes(): void {
    this.router.get(
      '/users/residences/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getById()
      ],
      this.controller.getResidencesByUserId
    );
  }
}
