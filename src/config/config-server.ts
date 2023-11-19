import { DataSource } from 'typeorm';
import { AppDataSource } from '../database';
import { Environments } from './environments';

export abstract class ConfigServer extends Environments {

  constructor(
    private readonly _appDataSource = AppDataSource.getInstance(),
  ) {
    super();
  }

  private get dataSource(): DataSource {
    return this._appDataSource.getSource();
  }

  protected async initDbConnect(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.info('Database connected!');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
}
