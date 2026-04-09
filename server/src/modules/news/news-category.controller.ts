import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { NewsService } from './news.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/news-categories')
export class NewsCategoryController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @Permissions('news-category:view')
  list() {
    return this.newsService.listCategories();
  }

  @Post()
  @Permissions('news-category:create')
  create(@Body() dto: CreateNewsCategoryDto) {
    return this.newsService.createCategory(dto);
  }
}
