import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserModule } from './modules/admin-user/admin-user.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { NewsModule } from './modules/news/news.module';
import { ProductModule } from './modules/product/product.module';
import { RoleModule } from './modules/role/role.module';
import { SiteContentModule } from './modules/site-content/site-content.module';
import { CacheRevalidationModule } from './modules/cache-revalidation/cache-revalidation.module';
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
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
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
    CacheRevalidationModule,
    SiteContentModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
