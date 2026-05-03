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

interface ListQuery {
  page?: number;
  pageSize?: number;
}

function withListQuery(path: string, query: ListQuery = {}) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return `${path}?${params.toString()}`;
}

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

  getNewsList(query?: ListQuery) {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 10;

    return fetchApi<ListResult<NewsItem>>(withListQuery('/public/news', { page, pageSize }), {
      revalidate: CACHE_DURATION.SHORT,
      tags: ['news-list', `news-list-${page}-${pageSize}`],
    });
  },

  getNewsDetail(id: string) {
    return fetchApi<NewsItem>(`/public/news/${id}`, {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: [`news-${id}`],
    });
  },

  getAnnouncements(query?: ListQuery) {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 10;

    return fetchApi<ListResult<AnnouncementItem>>(withListQuery('/public/announcements', { page, pageSize }), {
      revalidate: CACHE_DURATION.SHORT,
      tags: ['announcements-list', `announcements-list-${page}-${pageSize}`],
    });
  },

  getAnnouncementDetail(id: string) {
    return fetchApi<AnnouncementItem>(`/public/announcements/${id}`, {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: [`announcement-${id}`],
    });
  },

  getProducts(query?: ListQuery) {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 10;

    return fetchApi<ListResult<ProductItem>>(withListQuery('/public/products', { page, pageSize }), {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: ['products-list', `products-list-${page}-${pageSize}`],
    });
  },

  getProductDetail(id: string) {
    return fetchApi<ProductItem>(`/public/products/${id}`, {
      revalidate: CACHE_DURATION.MEDIUM,
      tags: [`product-${id}`],
    });
  },
};
