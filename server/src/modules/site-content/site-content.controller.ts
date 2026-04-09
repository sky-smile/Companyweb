import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request.type';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateSitePageDto } from './dto/update-site-page.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteContentService } from './site-content.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get('site-pages/:key')
  @Permissions('site-page:view')
  getSitePage(@Param('key') key: string) {
    return this.siteContentService.getSitePage(key);
  }

  @Put('site-pages/:key')
  @Permissions('site-page:update')
  updateSitePage(
    @Param('key') key: string,
    @Body() dto: UpdateSitePageDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.siteContentService.updateSitePage(key, dto, request.user);
  }

  @Get('site-settings')
  @Permissions('site-setting:view')
  listSiteSettings() {
    return this.siteContentService.listSiteSettings();
  }

  @Put('site-settings')
  @Permissions('site-setting:update')
  updateSiteSettings(@Body() dto: UpdateSiteSettingsDto, @Req() request: AuthenticatedRequest) {
    return this.siteContentService.updateSiteSettings(dto, request.user);
  }

  @Get('banners')
  @Permissions('banner:view')
  listBanners() {
    return this.siteContentService.listBanners();
  }

  @Post('banners')
  @Permissions('banner:create')
  createBanner(@Body() dto: CreateBannerDto) {
    return this.siteContentService.createBanner(dto);
  }

  @Patch('banners/:id')
  @Permissions('banner:update')
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.siteContentService.updateBanner(id, dto);
  }

  @Delete('banners/:id')
  @Permissions('banner:delete')
  deleteBanner(@Param('id') id: string) {
    return this.siteContentService.deleteBanner(id);
  }
}
