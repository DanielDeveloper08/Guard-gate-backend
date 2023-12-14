import { GlobalMiddleware } from '../../middlewares/global-middleware';
import { BaseRouter } from '../../shared/base-router';
import { VisitorController } from './controller';
import { VisitorValidations } from './validations';

export class VisitorRouter extends BaseRouter<
  VisitorController,
  VisitorValidations
> {
  constructor() {
    super(VisitorController, VisitorValidations);
  }

  initRoutes(): void {
    this.router.get(
      '/visitors',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getAll(),
      ],
      this.controller.getAll
    );

    this.router.post(
      '/visitors',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.create(),
      ],
      this.controller.create
    );
  }
}
