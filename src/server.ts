import http from 'node:http';
import express from 'express';
import io from 'socket.io';
import cors from 'cors';
import { ConfigServer } from './config/config-server';
import { GlobalMiddleware } from './middlewares/global-middleware';
import { AuthRouter, UserRouter, ResidencyRouter, RoleRouter, VisitorRouter } from './modules';
import { PanicAlertEvent } from './events/panic-alert/event';

class AppServer extends ConfigServer {
  private readonly app: express.Application;
  private readonly httpServer: http.Server;
  private readonly ioServer: io.Server;
  private readonly port: number = this.getNumberEnv('PORT') ?? 5000;

  constructor() {
    super();
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.ioServer = new io.Server(this.httpServer, {
      cors: { origin: '*' },
    });

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
      new ResidencyRouter().router,
      new RoleRouter().router,
      new VisitorRouter().router,
    ];
  }

  private listenSockets() {
    const panicAlertEvent = new PanicAlertEvent();

    this.ioServer.on('connection', (socket) => {
      const handshakeId = socket.id;
      const auth = socket.handshake.auth;
      const serial = auth.serial;

      console.info('Conecction ID', handshakeId);

      panicAlertEvent.init(socket);
    });
  }

  public listen() {
    this.listenSockets();

    this.httpServer.listen(this.port, () => {
      process.env.TZ = 'America/Guayaquil';
      console.info(`Server started on port: ${this.port}`);
    });
  }
}

const server = new AppServer();
server.listen();
