import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request.type';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsListQueryDto } from './dto/news-list-query.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @Permissions('news:view')
  list(@Query() query: NewsListQueryDto) {
    return this.newsService.listNews(query);
  }

  @Get(':id')
  @Permissions('news:view')
  detail(@Param('id') id: string) {
    return this.newsService.getNewsDetail(id);
  }

  @Post()
  @Permissions('news:create')
  create(@Body() dto: CreateNewsDto, @Req() request: AuthenticatedRequest) {
    return this.newsService.createNews(dto, request.user);
  }

  @Patch(':id')
  @Permissions('news:update')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.newsService.updateNews(id, dto, request.user);
  }
}
