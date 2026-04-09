import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsListQueryDto } from './dto/news-list-query.dto';
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

  async listNews(query: NewsListQueryDto) {
    const page = Number(query.page ?? 1) || 1;
    const pageSize = Number(query.pageSize ?? 10) || 10;
    const newsList = await this.newsRepository.listNews();

    const filtered = newsList.filter((item) => {
      if (query.keyword === undefined || query.keyword.trim() === '') {
        return true;
      }

      return [item.title, item.summary, item.slug].some((value) =>
        value.toLowerCase().includes(query.keyword!.toLowerCase()),
      );
    });

    const start = (page - 1) * pageSize;

    return {
      list: filtered.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        total: filtered.length,
      },
    };
  }

  getNewsDetail(id: string) {
    return this.newsRepository.findNewsById(id);
  }

  createNews(dto: CreateNewsDto, currentUser: AuthenticatedAdminUser) {
    return this.newsRepository.createNews(dto, currentUser.userId);
  }

  updateNews(id: string, dto: UpdateNewsDto, currentUser: AuthenticatedAdminUser) {
    return this.newsRepository.updateNews(id, dto, currentUser.userId);
  }
}
