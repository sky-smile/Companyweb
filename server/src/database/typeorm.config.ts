import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { appConfig } from '@/config/app.config';
import { AdminUserRoleEntity } from './entities/admin-user-role.entity';
import { AdminUserEntity } from './entities/admin-user.entity';
import { NewsCategoryEntity } from './entities/news-category.entity';
import { NewsEntity } from './entities/news.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RoleEntity } from './entities/role.entity';

export const typeOrmEntities = [
  AdminUserEntity,
  RoleEntity,
  PermissionEntity,
  AdminUserRoleEntity,
  RolePermissionEntity,
  NewsCategoryEntity,
  NewsEntity,
];

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  const config = appConfig();

  return {
    type: config.database.type as 'mariadb' | 'mysql',
    host: config.database.host,
    port: config.database.port,
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    entities: typeOrmEntities,
    autoLoadEntities: true,
    synchronize: config.database.synchronize,
    logging: config.database.logging || config.server.nodeEnv === 'development',
  };
};
