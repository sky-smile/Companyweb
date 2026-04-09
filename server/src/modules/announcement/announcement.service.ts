import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { AnnouncementListQueryDto } from './dto/announcement-list-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementRepository } from './announcement.repository';

@Injectable()
export class AnnouncementService {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  async list(query: AnnouncementListQueryDto) {
    const page = Number(query.page ?? 1) || 1;
    const pageSize = Number(query.pageSize ?? 10) || 10;
    const list = await this.announcementRepository.list();
    const filtered = list.filter((item) => {
      if (query.keyword === undefined || query.keyword.trim() === '') {
        return true;
      }

      return [item.title, item.summary].some((value) =>
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

  detail(id: string) {
    return this.announcementRepository.detail(id);
  }

  create(dto: CreateAnnouncementDto, currentUser: AuthenticatedAdminUser) {
    return this.announcementRepository.create(dto, currentUser.userId);
  }

  update(id: string, dto: UpdateAnnouncementDto, currentUser: AuthenticatedAdminUser) {
    return this.announcementRepository.update(id, dto, currentUser.userId);
  }

  delete(id: string) {
    return this.announcementRepository.delete(id);
  }

  async listPublic(query: AnnouncementListQueryDto) {
    const page = Number(query.page ?? 1) || 1;
    const pageSize = Number(query.pageSize ?? 10) || 10;
    const list = await this.announcementRepository.listPublic();
    const filtered = list.filter((item) => {
      if (query.keyword === undefined || query.keyword.trim() === '') {
        return true;
      }

      return [item.title, item.summary].some((value) =>
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

  detailPublic(id: string) {
    return this.announcementRepository.detailPublic(id);
  }
}
