import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({ path: '.env' });

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  extra: {
    max: Number(process.env.DB_POOL_MAX) || 10,
    min: Number(process.env.DB_POOL_MIN) || 1,
  },
};

export const AppDataSource = new DataSource(typeOrmConfig);
