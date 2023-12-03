import { GlobalMiddleware } from '../../middlewares/global-middleware';
import { BaseRouter } from '../../shared/base-router';
import { ResidencyController } from './controller';
import { ResidencyValidations } from './validations';

export class ResidencyRouter extends BaseRouter<ResidencyController, ResidencyValidations> {

  constructor() {
    super(ResidencyController, ResidencyValidations);
  }

  initRoutes(): void {
    this.router.get(
      '/residences',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getAll()
      ],
      this.controller.getAll
    );

    this.router.post(
      '/residences',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.create()
      ],
      this.controller.create
    );
  }
}
