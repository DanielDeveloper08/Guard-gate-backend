import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '../entities/user.entity';

dotenv.config();

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: JSON.parse(process.env.DB_SYNC!),
  logging: false,
  entities: [
    UserEntity,
  ],
  migrations: [],
  poolSize: 10,
};

export const AppDataSource: DataSource = new DataSource(dataSourceConfig);
