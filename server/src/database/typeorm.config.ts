import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { appConfig } from '@/config/app.config';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  const config = appConfig();

  return {
    type: 'mysql',
    host: config.database.host,
    port: config.database.port,
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    autoLoadEntities: true,
    synchronize: false,
    logging: config.server.nodeEnv === 'development',
    manualInitialization: true,
  };
};
