import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from '@/database/entities/banner.entity';
import { SitePageEntity } from '@/database/entities/site-page.entity';
import { SiteSettingEntity } from '@/database/entities/site-setting.entity';
import { PublicSiteContentController } from './public-site-content.controller';
import { SiteContentController } from './site-content.controller';
import { SiteContentRepository } from './site-content.repository';
import { SiteContentService } from './site-content.service';

@Module({
  imports: [TypeOrmModule.forFeature([SitePageEntity, SiteSettingEntity, BannerEntity])],
  controllers: [SiteContentController, PublicSiteContentController],
  providers: [SiteContentRepository, SiteContentService],
})
export class SiteContentModule {}
