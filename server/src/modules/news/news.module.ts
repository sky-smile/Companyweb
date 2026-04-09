import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsCategoryEntity } from '@/database/entities/news-category.entity';
import { NewsEntity } from '@/database/entities/news.entity';
import { NewsCategoryController } from './news-category.controller';
import { NewsController } from './news.controller';
import { PublicNewsController } from './public-news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsEntity, NewsCategoryEntity])],
  controllers: [NewsController, NewsCategoryController, PublicNewsController],
  providers: [NewsRepository, NewsService],
})
export class NewsModule {}
