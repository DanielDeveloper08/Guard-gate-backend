import { GlobalMiddleware } from '../../middlewares/global-middleware';
import { BaseRouter } from '../../shared/base-router';
import { VisitController } from './controller';
import { VisitValidations } from './validations';

export class VisitRouter extends BaseRouter<VisitController, VisitValidations> {
  constructor() {
    super(VisitController, VisitValidations);
  }

  initRoutes(): void {
    this.router.post(
      '/visits',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.create(),
      ],
      this.controller.create
    );

    this.router.get(
      '/visits/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getById(),
      ],
      this.controller.getById
    );
  }
}
