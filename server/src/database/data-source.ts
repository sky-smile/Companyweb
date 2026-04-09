import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { appConfig } from '@/config/app.config';
import { typeOrmEntities } from './typeorm.config';

const config = appConfig();

export const AppDataSource = new DataSource({
  type: config.database.type as 'mariadb' | 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  entities: typeOrmEntities,
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: config.database.logging,
});

export default AppDataSource;
