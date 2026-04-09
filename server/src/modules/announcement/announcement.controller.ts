import {
  Body,
  Controller,
  Delete,
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
import { AnnouncementListQueryDto } from './dto/announcement-list-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementService } from './announcement.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @Permissions('announcement:view')
  list(@Query() query: AnnouncementListQueryDto) {
    return this.announcementService.list(query);
  }

  @Get(':id')
  @Permissions('announcement:view')
  detail(@Param('id') id: string) {
    return this.announcementService.detail(id);
  }

  @Post()
  @Permissions('announcement:create')
  create(@Body() dto: CreateAnnouncementDto, @Req() request: AuthenticatedRequest) {
    return this.announcementService.create(dto, request.user);
  }

  @Patch(':id')
  @Permissions('announcement:update')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.announcementService.update(id, dto, request.user);
  }

  @Delete(':id')
  @Permissions('announcement:delete')
  delete(@Param('id') id: string) {
    return this.announcementService.delete(id);
  }
}
