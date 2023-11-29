import { Request, Response } from 'express';
import { GlobalMiddleware } from '../../middlewares/global-middleware';
import { BaseRouter } from '../../shared/base-router';
import { UserController } from './controller';

export class UserRouter extends BaseRouter<UserController> {

  constructor() {
    super(UserController);
  }

  initializeRoutes(): void {
    this.router.get(
      '/users',
      [
        GlobalMiddleware.validateJwtToken
      ],
      (req: Request, res: Response) => res.json({ message: 'Hello World' })
    )
  }
}
