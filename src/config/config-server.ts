import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
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

  public get initConnect(): Promise<DataSource> {
    return AppDataSource.initialize();
  }
}
