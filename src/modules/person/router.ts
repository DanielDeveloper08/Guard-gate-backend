import { GlobalMiddleware } from '../../middlewares/global-middleware';
import { BaseRouter } from '../../shared/base-router';
import { PersonController } from './controller';
import { PersonValidations } from './validations';

export class PersonRouter extends BaseRouter<
  PersonController,
  PersonValidations
> {
  constructor() {
    super(PersonController, PersonValidations);
  }

  initRoutes(): void {
    this.router.get(
      '/persons',
      [
        GlobalMiddleware.validateJwtToken,
        this.validation!.getAll()
      ],
      this.controller.getAll
    );
  }
}
