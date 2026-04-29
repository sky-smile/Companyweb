import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BannerEntity } from '@/database/entities/banner.entity';
import { SitePageEntity } from '@/database/entities/site-page.entity';
import { SiteSettingEntity } from '@/database/entities/site-setting.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateSitePageDto } from './dto/update-site-page.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { BannerView } from './interfaces/banner-view.interface';
import { SitePageView } from './interfaces/site-page-view.interface';
import { SiteSettingView } from './interfaces/site-setting-view.interface';

@Injectable()
export class SiteContentRepository {
  constructor(
    @InjectRepository(SitePageEntity)
    private readonly sitePageRepository: Repository<SitePageEntity>,
    @InjectRepository(SiteSettingEntity)
    private readonly siteSettingRepository: Repository<SiteSettingEntity>,
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getSitePage(pageKey: string): Promise<SitePageView> {
    const page = await this.sitePageRepository.findOne({ where: { pageKey } });

    if (page === null) {
      const created = await this.sitePageRepository.save(
        this.sitePageRepository.create({
          pageKey,
          title: '',
          content: '',
          extraJson: '',
          seoTitle: '',
          seoDescription: '',
          status: 1,
        }),
      );

      return this.toSitePageView(created);
    }

    return this.toSitePageView(page);
  }

  async updateSitePage(pageKey: string, dto: UpdateSitePageDto, userId: string): Promise<SitePageView> {
    const current = await this.getSitePageEntity(pageKey);

    current.title = dto.title ?? current.title;
    current.content = dto.content ?? current.content;
    current.extraJson = dto.extraJson ?? current.extraJson;
    current.seoTitle = dto.seoTitle ?? current.seoTitle;
    current.seoDescription = dto.seoDescription ?? current.seoDescription;
    current.status = dto.status ?? current.status;
    current.updatedBy = userId;

    const saved = await this.sitePageRepository.save(current);
    return this.toSitePageView(saved);
  }

  async listSiteSettings(): Promise<SiteSettingView[]> {
    const items = await this.siteSettingRepository.find({
      order: {
        settingGroup: 'ASC',
        settingKey: 'ASC',
      },
    });

    return items.map((item) => this.toSiteSettingView(item));
  }

  async updateSiteSettings(dto: UpdateSiteSettingsDto, userId: string): Promise<SiteSettingView[]> {
    await this.dataSource.transaction(async (manager) => {
      const settingRepo = manager.getRepository(SiteSettingEntity);

      for (const item of dto.items) {
        const existing = await settingRepo.findOne({ where: { settingKey: item.settingKey } });

        if (existing === null) {
          await settingRepo.save(
            settingRepo.create({
              settingKey: item.settingKey,
              settingValue: item.settingValue,
              settingGroup: item.settingGroup,
              description: item.description,
              updatedBy: userId,
            }),
          );
          continue;
        }

        existing.settingValue = item.settingValue;
        existing.settingGroup = item.settingGroup;
        existing.description = item.description;
        existing.updatedBy = userId;
        await settingRepo.save(existing);
      }
    });

    return this.listSiteSettings();
  }

  async listBanners(publicOnly = false): Promise<BannerView[]> {
    const banners = await this.bannerRepository.find({
      where: publicOnly ? { status: 1 } : {},
      order: {
        sort: 'ASC',
        id: 'ASC',
      },
    });

    return banners.map((item) => this.toBannerView(item));
  }

  async createBanner(dto: CreateBannerDto): Promise<BannerView> {
    const banner = await this.bannerRepository.save(
      this.bannerRepository.create({
        title: dto.title ?? '',
        subtitle: dto.subtitle ?? '',
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl ?? '',
        sort: dto.sort,
        status: 1,
      }),
    );

    return this.toBannerView(banner);
  }

  async updateBanner(id: string, dto: UpdateBannerDto): Promise<BannerView> {
    const banner = await this.bannerRepository.findOne({ where: { id } });

    if (banner === null) {
      throw new NotFoundException('Banner not found');
    }

    banner.title = dto.title ?? banner.title;
    banner.subtitle = dto.subtitle ?? banner.subtitle;
    banner.imageUrl = dto.imageUrl ?? banner.imageUrl;
    banner.linkUrl = dto.linkUrl ?? banner.linkUrl;
    banner.sort = dto.sort ?? banner.sort;
    banner.status = dto.status ?? banner.status;

    const saved = await this.bannerRepository.save(banner);
    return this.toBannerView(saved);
  }

  async deleteBanner(id: string): Promise<void> {
    const result = await this.bannerRepository.delete({ id });

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('Banner not found');
    }
  }

  private async getSitePageEntity(pageKey: string): Promise<SitePageEntity> {
    const existing = await this.sitePageRepository.findOne({ where: { pageKey } });

    if (existing !== null) {
      return existing;
    }

    return this.sitePageRepository.save(
      this.sitePageRepository.create({
        pageKey,
        title: '',
        content: '',
        extraJson: '',
        seoTitle: '',
        seoDescription: '',
        status: 1,
      }),
    );
  }

  private toSitePageView(page: SitePageEntity): SitePageView {
    return {
      pageKey: page.pageKey,
      title: page.title,
      content: page.content,
      extraJson: page.extraJson,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      status: page.status,
    };
  }

  private toSiteSettingView(item: SiteSettingEntity): SiteSettingView {
    return {
      settingKey: item.settingKey,
      settingValue: item.settingValue,
      settingGroup: item.settingGroup,
      description: item.description,
    };
  }

  private toBannerView(item: BannerEntity): BannerView {
    return {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      sort: item.sort,
      status: item.status,
    };
  }
}
