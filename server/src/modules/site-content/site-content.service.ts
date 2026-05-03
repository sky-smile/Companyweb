import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { sanitizeHtmlContent } from '@/common/utils/html-sanitizer';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateSitePageDto } from './dto/update-site-page.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteContentRepository } from './site-content.repository';
import { CacheRevalidationService } from '../cache-revalidation/cache-revalidation.service';

@Injectable()
export class SiteContentService {
  constructor(
    private readonly siteContentRepository: SiteContentRepository,
    private readonly cacheRevalidation: CacheRevalidationService,
  ) {}

  getSitePage(pageKey: string) {
    return this.siteContentRepository.getSitePage(pageKey);
  }

  async updateSitePage(pageKey: string, dto: UpdateSitePageDto, currentUser: AuthenticatedAdminUser) {
    // 清理 HTML 内容，去除危险标签和不必要的行内样式
    const sanitizedDto = {
      ...dto,
      content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content,
    };
    const result = await this.siteContentRepository.updateSitePage(pageKey, sanitizedDto, currentUser.userId);
    this.cacheRevalidation.revalidate([pageKey]).catch(() => {});
    return result;
  }

  listSiteSettings() {
    return this.siteContentRepository.listSiteSettings();
  }

  async updateSiteSettings(dto: UpdateSiteSettingsDto, currentUser: AuthenticatedAdminUser) {
    const result = await this.siteContentRepository.updateSiteSettings(dto, currentUser.userId);
    this.cacheRevalidation.revalidate(['home', 'contact']).catch(() => {});
    return result;
  }

  listBanners() {
    return this.siteContentRepository.listBanners();
  }

  async createBanner(dto: CreateBannerDto) {
    const result = await this.siteContentRepository.createBanner(dto);
    this.cacheRevalidation.revalidate(['home']).catch(() => {});
    return result;
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    const result = await this.siteContentRepository.updateBanner(id, dto);
    this.cacheRevalidation.revalidate(['home']).catch(() => {});
    return result;
  }

  async deleteBanner(id: string) {
    const result = await this.siteContentRepository.deleteBanner(id);
    this.cacheRevalidation.revalidate(['home']).catch(() => {});
    return result;
  }

  async getHomeContent() {
    const [banners, homePage, siteSettings] = await Promise.all([
      this.siteContentRepository.listBanners(true),
      this.siteContentRepository.getSitePage('home'),
      this.siteContentRepository.listSiteSettings(),
    ]);

    return {
      banners,
      page: homePage,
      settings: siteSettings,
    };
  }

  getAboutContent() {
    return this.siteContentRepository.getSitePage('about');
  }

  async getContactContent() {
    const [page, settings] = await Promise.all([
      this.siteContentRepository.getSitePage('contact'),
      this.siteContentRepository.listSiteSettings(),
    ]);

    return {
      page,
      settings,
    };
  }
}
