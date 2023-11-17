import express from 'express';
import cors from 'cors';
import { ConfigServer } from './config/config-server';
import { AuthRouter } from './modules/auth/router';

class AppServer extends ConfigServer {
  private readonly app: express.Application;
  private readonly port: number = this.getNumberEnv('PORT') ?? 5000;

  constructor() {
    super();
    this.app = express();
    this.middlewares();

    this.app.use('/api/v1', this.routers());
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routers(): Array<express.Router> {
    return [
      new AuthRouter().router
    ];
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`Listen in port: ${this.port}`);
    });
  }
}

const server = new AppServer();
server.listen();
