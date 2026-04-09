import { fetchApi } from '@/lib/api';
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
    return fetchApi<HomeResponse>('/public/home');
  },

  getAbout() {
    return fetchApi<SitePageContent>('/public/about');
  },

  getContact() {
    return fetchApi<ContactResponse>('/public/contact');
  },

  getNewsList() {
    return fetchApi<ListResult<NewsItem>>('/public/news');
  },

  getNewsDetail(id: string) {
    return fetchApi<NewsItem>(`/public/news/${id}`);
  },

  getAnnouncements() {
    return fetchApi<ListResult<AnnouncementItem>>('/public/announcements');
  },

  getAnnouncementDetail(id: string) {
    return fetchApi<AnnouncementItem>(`/public/announcements/${id}`);
  },

  getProducts() {
    return fetchApi<ListResult<ProductItem>>('/public/products');
  },

  getProductDetail(id: string) {
    return fetchApi<ProductItem>(`/public/products/${id}`);
  },
};
