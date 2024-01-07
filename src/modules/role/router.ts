import { BaseRouter } from '../../shared/base-router';
import { RoleController } from './controller';
import { RoleValidations } from './validations';
import { GlobalMiddleware } from '../../middlewares/global-middleware';

export class RoleRouter extends BaseRouter<RoleController, RoleValidations> {
  constructor() {
    super(RoleController, RoleValidations);
  }

  initRoutes(): void {
    this.router.get(
      '/role/:rolename',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getRoleByName()
      ],
      this.controller.getRoleByName
    );
    this.router.get(
      '/roles',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getAll()
      ],
      this.controller.getAll
    );

    this.router.put(
      '/roles/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.update()
      ],
      this.controller.update
    );
  }
}
