import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { sanitizeHtmlContent } from '@/common/utils/html-sanitizer';
import { formatPaginatedResult } from '@/common/utils/paginate';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  async listCategories() {
    return this.newsRepository.listCategories();
  }

  createCategory(dto: CreateNewsCategoryDto) {
    return this.newsRepository.createCategory(dto);
  }

  updateCategory(id: string, dto: UpdateNewsCategoryDto) {
    return this.newsRepository.updateCategory(id, dto);
  }

  deleteCategory(id: string) {
    return this.newsRepository.deleteCategory(id);
  }

  async listNews(query: ListQueryDto) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.newsRepository.listNewsPaginated(page, pageSize, keyword);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  getNewsDetail(id: string) {
    return this.newsRepository.findNewsById(id);
  }

  createNews(dto: CreateNewsDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    return this.newsRepository.createNews(sanitizedDto, currentUser.userId);
  }

  updateNews(id: string, dto: UpdateNewsDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    return this.newsRepository.updateNews(id, sanitizedDto, currentUser.userId);
  }

  deleteNews(id: string) {
    return this.newsRepository.deleteNews(id);
  }

  async listPublicNews(query: ListQueryDto) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.newsRepository.listPublicNewsPaginated(page, pageSize, keyword);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  getPublicNewsDetail(id: string) {
    return this.newsRepository.findPublicNewsById(id);
  }
}
