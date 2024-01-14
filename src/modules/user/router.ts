import { BaseRouter } from '../../shared/base-router';
import { UserController } from './controller';
import { UserValidations } from './validations';
import { GlobalMiddleware } from '../../middlewares/global-middleware';

export class UserRouter extends BaseRouter<UserController, UserValidations> {

  constructor() {
    super(UserController, UserValidations);
  }

  initRoutes(): void {
    this.router.get(
      '/users/residences',
      [
        GlobalMiddleware.validateJwtToken,
      ],
      this.controller.getResidencesByUserId
    );

    this.router.patch(
      '/users/main-residency',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.setMainResidency()
      ],
      this.controller.setMainResidency
    );

    this.router.get(
      '/users/notify-panic-alert',
      [
        GlobalMiddleware.validateJwtToken,
      ],
      this.controller.notifyPanicAlert
    );

    this.router.get(
      '/users',
      [
        GlobalMiddleware.validateJwtToken,
      ],
      this.controller.getAllUsers
    );
    this.router.get(
      '/users/residents',
      [
        GlobalMiddleware.validateJwtToken,
      ],
      this.controller.getAllResidentUsers
    );
    this.router.get(
      '/users/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getUserById()
      ],
      this.controller.getUser
    );
  }
}
