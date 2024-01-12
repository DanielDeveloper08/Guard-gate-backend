import { HomeController } from './controller';
import { BaseRouter } from '../../shared/base-router';
import { GlobalMiddleware } from '../../middlewares/global-middleware';
import { HomeValidations } from './validations';

export class HomeRouter extends BaseRouter<HomeController, HomeValidations> {

  constructor() {
    super(HomeController, HomeValidations);
  }

  initRoutes(): void {
    this.router.get(
      '/home/visits',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getVisitData(),
      ],
      this.controller.getVisitData
    );
  }
}
