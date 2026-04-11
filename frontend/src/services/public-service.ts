import { fetchApi, CACHE_DURATION } from '@/lib/api';
import {
  AnnouncementItem,
  ContactResponse,
  HomeResponse,
  ListResult,
  NewsItem,
  ProductItem,
  SitePageContent,
} from '@/types/public';

export const publicService = {
  getHome() {
    return fetchApi<HomeResponse>('/public/home', {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: ['home'],
    });
  },

  getAbout() {
    return fetchApi<SitePageContent>('/public/about', {
      revalidate: CACHE_DURATION.LONG,
      tags: ['about'],
    });
  },

  getContact() {
    return fetchApi<ContactResponse>('/public/contact', {
      revalidate: CACHE_DURATION.LONG,
      tags: ['contact'],
    });
  },

  getNewsList() {
    return fetchApi<ListResult<NewsItem>>('/public/news', {
      revalidate: CACHE_DURATION.SHORT,
      tags: ['news-list'],
    });
  },

  getNewsDetail(id: string) {
    return fetchApi<NewsItem>(`/public/news/${id}`, {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: [`news-${id}`],
    });
  },

  getAnnouncements() {
    return fetchApi<ListResult<AnnouncementItem>>('/public/announcements', {
      revalidate: CACHE_DURATION.SHORT,
      tags: ['announcements-list'],
    });
  },

  getAnnouncementDetail(id: string) {
    return fetchApi<AnnouncementItem>(`/public/announcements/${id}`, {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: [`announcement-${id}`],
    });
  },

  getProducts() {
    return fetchApi<ListResult<ProductItem>>('/public/products', {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: ['products-list'],
    });
  },

  getProductDetail(id: string) {
    return fetchApi<ProductItem>(`/public/products/${id}`, {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: [`product-${id}`],
    });
  },
};
