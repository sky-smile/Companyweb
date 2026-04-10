import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementEntity } from '@/database/entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementView } from './interfaces/announcement-view.interface';

@Injectable()
export class AnnouncementRepository {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>,
  ) {}

  async list(): Promise<AnnouncementView[]> {
    const items = await this.announcementRepository.find({
      order: {
        isTop: 'DESC',
        createdAt: 'DESC',
      },
    });

    return items.map((item) => this.toView(item));
  }

  async detail(id: string): Promise<AnnouncementView> {
    const item = await this.announcementRepository.findOne({ where: { id } });

    if (item === null) {
      throw new NotFoundException('Announcement not found');
    }

    return this.toView(item);
  }

  async create(dto: CreateAnnouncementDto, userId: string): Promise<AnnouncementView> {
    const item = await this.announcementRepository.save(
      this.announcementRepository.create({
        title: dto.title,
        summary: dto.summary ?? '',
        content: dto.content,
        status: dto.status,
        isTop: dto.isTop,
        publishedAt: dto.status === 1 ? new Date() : null,
        createdBy: userId,
        updatedBy: userId,
      }),
    );

    return this.detail(item.id);
  }

  async update(id: string, dto: UpdateAnnouncementDto, userId: string): Promise<AnnouncementView> {
    const item = await this.announcementRepository.findOne({ where: { id } });

    if (item === null) {
      throw new NotFoundException('Announcement not found');
    }

    item.title = dto.title ?? item.title;
    item.summary = dto.summary ?? item.summary;
    item.content = dto.content ?? item.content;
    item.status = dto.status ?? item.status;
    item.isTop = dto.isTop ?? item.isTop;
    item.publishedAt = item.status === 1 ? item.publishedAt ?? new Date() : null;
    item.updatedBy = userId;

    await this.announcementRepository.save(item);

    return this.detail(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.announcementRepository.delete({ id });

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('Announcement not found');
    }
  }

  async listPublic(): Promise<AnnouncementView[]> {
    const items = await this.announcementRepository.find({
      where: {
        status: 1,
      },
      order: {
        isTop: 'DESC',
        publishedAt: 'DESC',
        id: 'DESC',
      },
    });

    return items.map((item) => this.toView(item));
  }

  async detailPublic(id: string): Promise<AnnouncementView> {
    const item = await this.announcementRepository.findOne({
      where: {
        id,
        status: 1,
      },
    });

    if (item === null) {
      throw new NotFoundException('Announcement not found');
    }

    return this.toView(item);
  }

  private toView(item: AnnouncementEntity): AnnouncementView {
    return {
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      status: item.status,
      isTop: item.isTop,
      publishedAt: item.publishedAt,
    };
  }
}
