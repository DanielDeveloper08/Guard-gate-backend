import { BaseRouter } from '../../shared/base-router';
import { UrbanizationController } from './controller';
import { UrbanizationValidations } from './validations';
import { GlobalMiddleware } from '../../middlewares/global-middleware';

export class UrbanizationRouter extends BaseRouter<
  UrbanizationController,
  UrbanizationValidations
> {
  constructor() {
    super(UrbanizationController, UrbanizationValidations);
  }

  initRoutes(): void {
    this.router.get(
      '/urbanization/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getOne(),
      ],
      this.controller.getOne
    );

    this.router.post(
      '/urbanization',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.create()
      ],
      this.controller.create
    );

    this.router.put(
      '/urbanization/:id',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.update()
      ],
      this.controller.update
    );
  }
}
