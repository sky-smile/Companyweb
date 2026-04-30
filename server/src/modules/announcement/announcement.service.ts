import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { sanitizeHtmlContent } from '@/common/utils/html-sanitizer';
import { formatPaginatedResult } from '@/common/utils/paginate';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementRepository } from './announcement.repository';

@Injectable()
export class AnnouncementService {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  async list(query: ListQueryDto) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.announcementRepository.listPaginated(page, pageSize, keyword);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  detail(id: string) {
    return this.announcementRepository.detail(id);
  }

  create(dto: CreateAnnouncementDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    return this.announcementRepository.create(sanitizedDto, currentUser.userId);
  }

  update(id: string, dto: UpdateAnnouncementDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    return this.announcementRepository.update(id, sanitizedDto, currentUser.userId);
  }

  delete(id: string) {
    return this.announcementRepository.delete(id);
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
