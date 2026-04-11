export interface SitePageItem {
  pageKey: string;
  title: string;
  content: string;
  extraJson: string;
  seoTitle: string;
  seoDescription: string;
  status: number;
}

export interface SiteSettingItem {
  settingKey: string;
  settingValue: string;
  settingGroup: string;
  description: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  sort: number;
  status: number;
}

export interface UpdateSitePagePayload {
  title?: string;
  content?: string;
  extraJson?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: number;
}

export interface UpdateSiteSettingsPayload {
  items: SiteSettingItem[];
}

export interface CreateBannerPayload {
  title?: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  sort?: number;
  status?: number;
}

export interface UpdateBannerPayload {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  sort?: number;
  status?: number;
}
