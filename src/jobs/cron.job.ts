import cron from 'node-cron';
import { Environments } from '../config/environments';
import { AppDataSource } from '../database';
import { VisitService } from '../modules/visit/service';
import { CronExpEnum } from '../enums/cron-exp.enum';

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
    this._deamon = this._env.getEnv('CRON_JOB_MINUTES') ?? '';
  }

  public static getInstance(): CronJob {
    if (!CronJob._instance) {
      CronJob._instance = new CronJob();
    }

    return CronJob._instance;
  }

  public start(): void {
    if (!this._isReady) return;

    console.info('CronJob initialized!');
    const deamon = this.getValidDeamon();

    cron.schedule(
      deamon,
      this.executeTasks.bind(CronJob._instance)
    );
  }

  private validateCronExp(exp: string): boolean {
    return cron.validate(exp);
  }

  private getValidDeamon(): string {
    const key = this._deamon.padStart(2, '0');
    const value = CronExpEnum[key as keyof typeof CronExpEnum];

    const isValidExp = this.validateCronExp(value);
    return isValidExp ? value : CronExpEnum['03'];
  }

  private async executeTasks() {
    await this._visitSrv.synchronizeStatus(this._cnx);
  }
}
