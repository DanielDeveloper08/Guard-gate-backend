import { HomeController } from './controller';
import { BaseRouter } from '../../shared/base-router';
import { GlobalMiddleware } from '../../middlewares/global-middleware';

export class HomeRouter extends BaseRouter<HomeController> {

  constructor() {
    super(HomeController);
  }

  initRoutes(): void {
    this.router.get(
      '/home/visits',
      [
        GlobalMiddleware.validateJwtToken
      ],
      this.controller.getVisitData
    );
  }
}
