import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const entitiesPath = path.resolve('src', 'database', 'entities');

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    `${entitiesPath}/*.entity{.ts,.js}`
  ],
  migrations: [],
  poolSize: 10,
};

export const AppDataSource: DataSource = new DataSource(dataSourceConfig);
