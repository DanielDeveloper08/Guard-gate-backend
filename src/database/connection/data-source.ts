import { DataSource, DataSourceOptions, EntityManager } from 'typeorm';
import { Environments } from '../../config/environments';
import {
  ModuleEntity,
  OperationEntity,
  PersonEntity,
  RoleOperationEntity,
  RoleEntity,
  TokenOtpEntity,
  UserEntity,
} from '..';

export class AppDataSource extends Environments {
  private static instance: AppDataSource | null = null;
  private readonly dataSource: DataSource;

  private constructor() {
    super();
    const options = this.getOptions();
    this.dataSource = new DataSource(options);
  }

  private getOptions(): DataSourceOptions {
    return {
      type: 'postgres',
      host: this.getEnv('DB_HOST')!,
      port: this.getNumberEnv('DB_PORT')!,
      username: this.getEnv('DB_USER')!,
      password: this.getEnv('DB_PASS')!,
      database: this.getEnv('DB_NAME')!,
      synchronize: false,
      logging: false,
      entities: [
        ModuleEntity,
        OperationEntity,
        PersonEntity,
        RoleOperationEntity,
        RoleEntity,
        TokenOtpEntity,
        UserEntity,
      ],
      migrations: [],
      poolSize: 10,
      useUTC: true,
    };
  }

  public static getInstance(): AppDataSource {
    if (!AppDataSource.instance) {
      AppDataSource.instance = new AppDataSource();
    }

    return AppDataSource.instance;
  }

  public getSource(): DataSource {
    return this.dataSource;
  }

  public get cnx(): EntityManager {
    return this.getSource().manager;
  }
}
