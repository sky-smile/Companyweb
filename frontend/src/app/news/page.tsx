import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { NewsListClient } from './NewsListClient';

export const metadata: Metadata = buildMetadata({
  title: '新闻中心',
  description: '查看企业最新新闻、动态更新与业务资讯。',
  path: '/news',
});

export default function NewsListPage() {
  return <NewsListClient />;
}
