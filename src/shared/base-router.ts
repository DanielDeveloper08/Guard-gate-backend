import { Router, Request, Response, NextFunction } from 'express';

interface BaseRouterI {
  initializeRoutes(): void;
}

export abstract class BaseRouter<T, U = undefined> implements BaseRouterI {
  public router: Router;
  public controller: T;
  public middleware?: U;

  constructor(TController: new () => T, UMiddleware?: new () => U) {
    this.router = Router();
    this.controller = new TController();
    this.middleware = UMiddleware ? new UMiddleware() : undefined;

    this.initializeRoutes();
  }

  // protected handleMiddleware(
  //   _req: Request,
  //   _res: Response,
  //   next: NextFunction
  // ): void {
  //   if (this.middleware) {
  //     console.log('Middleware ejecutado!');
  //   }

  //   next();
  // }

  abstract initializeRoutes(): void;
}
