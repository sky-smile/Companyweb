import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityMetadataNotFoundError, Repository } from 'typeorm';
import { NewsCategoryEntity } from '@/database/entities/news-category.entity';
import { NewsEntity } from '@/database/entities/news.entity';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsView } from './interfaces/news-view.interface';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    @InjectRepository(NewsCategoryEntity)
    private readonly newsCategoryRepository: Repository<NewsCategoryEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async listCategories(): Promise<NewsCategoryEntity[]> {
    if (!this.isDatabaseReady()) {
      return [];
    }

    return this.newsCategoryRepository.find({
      order: {
        sort: 'ASC',
        id: 'ASC',
      },
    });
  }

  async createCategory(dto: CreateNewsCategoryDto): Promise<NewsCategoryEntity> {
    if (!this.isDatabaseReady()) {
      return {
        id: '1',
        name: dto.name,
        slug: dto.slug,
        sort: dto.sort,
        status: 1,
        newsList: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const existingCategory = await this.newsCategoryRepository.findOne({ where: { slug: dto.slug } });

    if (existingCategory !== null) {
      throw new BadRequestException('News category slug already exists');
    }

    return this.newsCategoryRepository.save(
      this.newsCategoryRepository.create({
        name: dto.name,
        slug: dto.slug,
        sort: dto.sort,
        status: 1,
      }),
    );
  }

  async updateCategory(id: string, dto: UpdateNewsCategoryDto): Promise<NewsCategoryEntity> {
    const category = await this.newsCategoryRepository.findOne({ where: { id } });

    if (category === null) {
      throw new NotFoundException('News category not found');
    }

    if (dto.slug !== undefined && dto.slug !== category.slug) {
      const existingCategory = await this.newsCategoryRepository.findOne({ where: { slug: dto.slug } });

      if (existingCategory !== null) {
        throw new BadRequestException('News category slug already exists');
      }
    }

    category.name = dto.name ?? category.name;
    category.slug = dto.slug ?? category.slug;
    category.sort = dto.sort ?? category.sort;
    category.status = dto.status ?? category.status;

    return this.newsCategoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const newsCount = await this.newsRepository.count({ where: { categoryId: id } });

    if (newsCount > 0) {
      throw new BadRequestException('Cannot delete category with existing news items');
    }

    const result = await this.newsCategoryRepository.delete({ id });

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('News category not found');
    }
  }

  async listNews(): Promise<NewsView[]> {
    if (!this.isDatabaseReady()) {
      return [];
    }

    const newsList = await this.newsRepository.find({
      relations: {
        category: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return newsList.map((item) => this.toView(item));
  }

  async findNewsById(id: string): Promise<NewsView> {
    if (!this.isDatabaseReady()) {
      throw new NotFoundException('News not found');
    }

    const news = await this.newsRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (news === null) {
      throw new NotFoundException('News not found');
    }

    return this.toView(news);
  }

  async createNews(dto: CreateNewsDto, userId: string): Promise<NewsView> {
    if (!this.isDatabaseReady()) {
      return {
        id: '1',
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary ?? '',
        coverImage: dto.coverImage ?? '',
        status: dto.status,
        isTop: dto.isTop,
        categoryId: dto.categoryId,
        categoryName: 'Fallback Category',
      };
    }

    await this.ensureCategoryExists(dto.categoryId);
    await this.ensureNewsSlugAvailable(dto.slug);

    const news = await this.newsRepository.save(
      this.newsRepository.create({
        categoryId: dto.categoryId,
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary ?? '',
        coverImage: dto.coverImage ?? '',
        content: dto.content,
        status: dto.status,
        isTop: dto.isTop,
        publishedAt: dto.status === 1 ? new Date() : null,
        seoTitle: '',
        seoDescription: '',
        createdBy: userId,
        updatedBy: userId,
      }),
    );

    return this.findNewsById(news.id);
  }

  async updateNews(id: string, dto: UpdateNewsDto, userId: string): Promise<NewsView> {
    if (!this.isDatabaseReady()) {
      throw new NotFoundException('News not found');
    }

    const news = await this.newsRepository.findOne({ where: { id } });

    if (news === null) {
      throw new NotFoundException('News not found');
    }

    if (dto.categoryId !== undefined) {
      await this.ensureCategoryExists(dto.categoryId);
      news.categoryId = dto.categoryId;
    }

    if (dto.slug !== undefined && dto.slug !== news.slug) {
      await this.ensureNewsSlugAvailable(dto.slug);
      news.slug = dto.slug;
    }

    news.title = dto.title ?? news.title;
    news.summary = dto.summary ?? news.summary;
    news.coverImage = dto.coverImage ?? news.coverImage;
    news.content = dto.content ?? news.content;
    news.status = dto.status ?? news.status;
    news.isTop = dto.isTop ?? news.isTop;
    news.publishedAt = news.status === 1 ? news.publishedAt ?? new Date() : null;
    news.updatedBy = userId;

    await this.newsRepository.save(news);

    return this.findNewsById(id);
  }

  async deleteNews(id: string): Promise<void> {
    const result = await this.newsRepository.delete({ id });

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('News not found');
    }
  }

  async listPublicNews(): Promise<NewsView[]> {
    const newsList = await this.newsRepository.find({
      where: {
        status: 1,
      },
      relations: {
        category: true,
      },
      order: {
        isTop: 'DESC',
        publishedAt: 'DESC',
        id: 'DESC',
      },
    });

    return newsList.map((item) => this.toView(item));
  }

  async findPublicNewsById(id: string): Promise<NewsView> {
    const news = await this.newsRepository.findOne({
      where: {
        id,
        status: 1,
      },
      relations: {
        category: true,
      },
    });

    if (news === null) {
      throw new NotFoundException('News not found');
    }

    return this.toView(news);
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.newsCategoryRepository.findOne({ where: { id: categoryId } });

    if (category === null) {
      throw new BadRequestException('News category does not exist');
    }
  }

  private async ensureNewsSlugAvailable(slug: string): Promise<void> {
    const existingNews = await this.newsRepository.findOne({ where: { slug } });

    if (existingNews !== null) {
      throw new BadRequestException('News slug already exists');
    }
  }

  private toView(news: NewsEntity): NewsView {
    return {
      id: news.id,
      title: news.title,
      slug: news.slug,
      summary: news.summary,
      coverImage: news.coverImage,
      status: news.status,
      isTop: news.isTop,
      categoryId: news.categoryId,
      categoryName: news.category?.name ?? '',
    };
  }

  private isDatabaseReady(): boolean {
    if (!this.dataSource.isInitialized) {
      return false;
    }

    try {
      return this.dataSource.hasMetadata(NewsEntity) && this.dataSource.hasMetadata(NewsCategoryEntity);
    } catch (error) {
      return !(error instanceof EntityMetadataNotFoundError);
    }
  }
}
