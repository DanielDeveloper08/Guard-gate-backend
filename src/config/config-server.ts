import { AppDataSource } from '../database';
import { Environments } from './environments';

export abstract class ConfigServer extends Environments {

  constructor(
    private readonly _appDataSource = AppDataSource.getInstance()
  ) {
    super();
  }

  protected async initDbConnect(): Promise<void> {
    try {
      await this._appDataSource.source.initialize();
      console.info('Database connected!');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
}
