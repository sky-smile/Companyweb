import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { appConfig } from '@/config/app.config';
import { typeOrmEntities } from './typeorm.config';
import { AddAnnouncementsTable1712607200000 } from './migrations/1712607200000-add-announcements-table';
import { AddNewsTables1712603600000 } from './migrations/1712603600000-add-news-tables';
import { AddProductTables1712614400000 } from './migrations/1712614400000-add-product-tables';
import { AddSiteContentTables1712610800000 } from './migrations/1712610800000-add-site-content-tables';
import { InitAuthRbac1712600000000 } from './migrations/1712600000000-init-auth-rbac';
import { AddMediaFilesTable1712620000000 } from './migrations/1712620000000-add-media-files-table';
import { AddTokenVersionToAdminUsers1775909200000 } from './migrations/1775909200000-add-token-version-to-admin-users';

const config = appConfig();

export const AppDataSource = new DataSource({
  type: config.database.type as 'mariadb' | 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  entities: typeOrmEntities,
  migrations: [
    InitAuthRbac1712600000000,
    AddNewsTables1712603600000,
    AddAnnouncementsTable1712607200000,
    AddSiteContentTables1712610800000,
    AddProductTables1712614400000,
    AddMediaFilesTable1712620000000,
    AddTokenVersionToAdminUsers1775909200000,
  ],
  synchronize: false,
  logging: config.database.logging,
});

// 便捷导出供 CLI 使用
export default AppDataSource;
