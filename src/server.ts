import express from 'express';
import cors from 'cors';
import { ConfigServer } from './config/config-server';
import { AuthRouter } from './modules';
import { GlobalMiddleware } from './middlewares/global-middleware';
import { UserRouter } from './modules/user/router';

class AppServer extends ConfigServer {
  private readonly app: express.Application;
  private readonly port: number = this.getNumberEnv('PORT') ?? 5000;

  constructor() {
    super();
    this.app = express();
    this.middlewares();
    this.initDbConnect();
    this.app.use('/api/v1', this.routers());
    this.app.use(GlobalMiddleware.wrapValidations);
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routers(): Array<express.Router> {
    return [
      new AuthRouter().router,
      new UserRouter().router,
    ];
  }

  public listen() {
    this.app.listen(this.port, () => {
      process.env.TZ = 'America/Guayaquil';
      console.info(`Server started on port: ${this.port}`);
    });
  }
}

const server = new AppServer();
server.listen();
