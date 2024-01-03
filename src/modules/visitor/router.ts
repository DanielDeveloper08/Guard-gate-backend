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

    this.router.get(
      '/visitors/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getOne(),
      ],
      this.controller.getOne
    );

    this.router.post(
      '/visitors',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.create(),
      ],
      this.controller.create
    );

    this.router.put(
      '/visitors/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.update(),
      ],
      this.controller.update
    );

    this.router.delete(
      '/visitors/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.disable(),
      ],
      this.controller.disable
    );
  }
}
