export interface SitePageContent {
  pageKey: string;
  title: string;
  content: string;
  extraJson: string;
  seoTitle: string;
  seoDescription: string;
  status: number;
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

export interface SiteSettingItem {
  settingKey: string;
  settingValue: string;
  settingGroup: string;
  description: string;
}

export interface ListResult<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  status: number;
  isTop: number;
  categoryId: string;
  categoryName: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  summary: string;
  status: number;
  isTop: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  summary: string;
  imagesJson: string;
  parametersJson: string;
  status: number;
  sort: number;
  categoryId: string;
  categoryName: string;
}

export interface HomeResponse {
  banners: BannerItem[];
  page: SitePageContent;
  settings: SiteSettingItem[];
}

export interface ContactResponse {
  page: SitePageContent;
  settings: SiteSettingItem[];
}
