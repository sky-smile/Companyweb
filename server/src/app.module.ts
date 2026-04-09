import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserModule } from './modules/admin-user/admin-user.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { NewsModule } from './modules/news/news.module';
import { ProductModule } from './modules/product/product.module';
import { RoleModule } from './modules/role/role.module';
import { SiteContentModule } from './modules/site-content/site-content.module';
import { UploadModule } from './modules/upload/upload.module';
import { appConfig } from './config/app.config';
import { envValidationSchema } from './config/env.validation';
import { getTypeOrmConfig } from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
    }),
    AdminUserModule,
    AnnouncementModule,
    AuthModule,
    HealthModule,
    NewsModule,
    ProductModule,
    RoleModule,
    SiteContentModule,
    UploadModule,
  ],
})
export class AppModule {}
