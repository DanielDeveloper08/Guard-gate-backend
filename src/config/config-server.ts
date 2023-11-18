import * as dotenv from 'dotenv';
import { AppDataSource } from '../database';

export abstract class ConfigServer {
  constructor() {
    const nodeNameEnv = this.createPathEnv(this.nodeEnv);
    dotenv.config({
      path: nodeNameEnv,
    });
  }

  public getEnvironment(key: string): string | undefined {
    return process.env[key];
  }

  public getNumberEnv(key: string): number | undefined {
    return this.getEnvironment(key)
      ? Number(this.getEnvironment(key))
      : undefined;
  }

  public get nodeEnv(): string {
    return this.getEnvironment('NODE_ENV')?.trim() ?? '';
  }

  public createPathEnv(path: string): string {
    const arrEnv = ['env'];

    if (path.length > 0) {
      const stringToArray = path.split('.');
      arrEnv.unshift(...stringToArray);
    }

    return '.' + arrEnv.join('.');
  }

  protected async initDbConnect(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.info('Database connected!');
    } catch (error) {
      console.error('Database connection error', error);
    }
  }
}
