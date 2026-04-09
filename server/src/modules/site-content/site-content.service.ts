import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateSitePageDto } from './dto/update-site-page.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteContentRepository } from './site-content.repository';

@Injectable()
export class SiteContentService {
  constructor(private readonly siteContentRepository: SiteContentRepository) {}

  getSitePage(pageKey: string) {
    return this.siteContentRepository.getSitePage(pageKey);
  }

  updateSitePage(pageKey: string, dto: UpdateSitePageDto, currentUser: AuthenticatedAdminUser) {
    return this.siteContentRepository.updateSitePage(pageKey, dto, currentUser.userId);
  }

  listSiteSettings() {
    return this.siteContentRepository.listSiteSettings();
  }

  updateSiteSettings(dto: UpdateSiteSettingsDto, currentUser: AuthenticatedAdminUser) {
    return this.siteContentRepository.updateSiteSettings(dto, currentUser.userId);
  }

  listBanners() {
    return this.siteContentRepository.listBanners();
  }

  createBanner(dto: CreateBannerDto) {
    return this.siteContentRepository.createBanner(dto);
  }

  updateBanner(id: string, dto: UpdateBannerDto) {
    return this.siteContentRepository.updateBanner(id, dto);
  }

  deleteBanner(id: string) {
    return this.siteContentRepository.deleteBanner(id);
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
