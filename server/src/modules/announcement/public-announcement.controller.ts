import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { AnnouncementService } from './announcement.service';

@Controller('public/announcements')
export class PublicAnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  list(@Query() query: ListQueryDto) {
    return this.announcementService.listPublic(query);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.announcementService.detailPublic(id);
  }
}
