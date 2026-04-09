import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { appConfig } from '@/config/app.config';
import { AdminUserRoleEntity } from './entities/admin-user-role.entity';
import { AdminUserEntity } from './entities/admin-user.entity';
import { AnnouncementEntity } from './entities/announcement.entity';
import { BannerEntity } from './entities/banner.entity';
import { NewsCategoryEntity } from './entities/news-category.entity';
import { NewsEntity } from './entities/news.entity';
import { PermissionEntity } from './entities/permission.entity';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { ProductEntity } from './entities/product.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RoleEntity } from './entities/role.entity';
import { SitePageEntity } from './entities/site-page.entity';
import { SiteSettingEntity } from './entities/site-setting.entity';

export const typeOrmEntities = [
  AdminUserEntity,
  AnnouncementEntity,
  BannerEntity,
  RoleEntity,
  PermissionEntity,
  ProductCategoryEntity,
  ProductEntity,
  AdminUserRoleEntity,
  RolePermissionEntity,
  NewsCategoryEntity,
  NewsEntity,
  SitePageEntity,
  SiteSettingEntity,
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
