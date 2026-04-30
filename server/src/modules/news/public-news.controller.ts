import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { NewsService } from './news.service';

@Controller('public/news')
export class PublicNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  list(@Query() query: ListQueryDto) {
    return this.newsService.listPublicNews(query);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.newsService.getPublicNewsDetail(id);
  }
}
