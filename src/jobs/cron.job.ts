import cron from 'node-cron';
import { Environments } from '../config/environments';
import { AppDataSource } from '../database';
import { VisitService } from '../modules/visit/service';

export class CronJob {
  private static _instance: CronJob | null = null;
  private readonly _isReady: boolean;
  private readonly _deamon: string;

  private constructor(
    private readonly _env = new Environments(),
    private readonly _cnx = AppDataSource.getInstance().cnx,
    private readonly _visitSrv = new VisitService(),
  ) {
    this._isReady = this._env.getBoolEnv('ACTIVATE_CRON_JOB');
    this._deamon = this._env.getEnv('DEAMON_CRON_JOB')!;
  }

  public static getInstance(): CronJob {
    if (!CronJob._instance) {
      CronJob._instance = new CronJob();
    }

    return CronJob._instance;
  }

  public start(): void {
    if (!this._isReady) return;

    cron.schedule(
      this._deamon,
      this.executeTasks.bind(CronJob._instance)
    );
  }

  private async executeTasks() {
    await this._visitSrv.synchronizeStatus(this._cnx);
  }
}
