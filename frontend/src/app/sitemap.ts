import type { MetadataRoute } from 'next';
import { publicService } from '@/services/public-service';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3001';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/announcements`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  try {
    const [products, news, announcements] = await Promise.all([
      publicService.getProducts(),
      publicService.getNewsList(),
      publicService.getAnnouncements(),
    ]);

    const productPages: MetadataRoute.Sitemap = products.list.map((item) => ({
      url: `${baseUrl}/products/${item.id}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const newsPages: MetadataRoute.Sitemap = news.list.map((item) => ({
      url: `${baseUrl}/news/${item.id}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    const announcementPages: MetadataRoute.Sitemap = announcements.list.map((item) => ({
      url: `${baseUrl}/announcements/${item.id}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...productPages, ...newsPages, ...announcementPages];
  } catch {
    return staticPages;
  }
}
