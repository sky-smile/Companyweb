import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { sanitizeHtmlContent } from '@/common/utils/html-sanitizer';
import { formatPaginatedResult } from '@/common/utils/paginate';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementRepository } from './announcement.repository';
import { CacheRevalidationService } from '../cache-revalidation/cache-revalidation.service';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly cacheRevalidation: CacheRevalidationService,
  ) {}

  async list(query: ListQueryDto) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.announcementRepository.listPaginated(page, pageSize, keyword);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  detail(id: string) {
    return this.announcementRepository.detail(id);
  }

  async create(dto: CreateAnnouncementDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    const result = await this.announcementRepository.create(sanitizedDto, currentUser.userId);
    this.cacheRevalidation.revalidate(['announcements-list']).catch(() => {});
    return result;
  }

  async update(id: string, dto: UpdateAnnouncementDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    const result = await this.announcementRepository.update(id, sanitizedDto, currentUser.userId);
    this.cacheRevalidation.revalidate(['announcements-list', `announcement-${id}`]).catch(() => {});
    return result;
  }

  async delete(id: string) {
    const result = await this.announcementRepository.delete(id);
    this.cacheRevalidation.revalidate(['announcements-list', `announcement-${id}`]).catch(() => {});
    return result;
  }

  async listPublic(query: ListQueryDto) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.announcementRepository.listPublicPaginated(page, pageSize, keyword);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  detailPublic(id: string) {
    return this.announcementRepository.detailPublic(id);
  }
}
