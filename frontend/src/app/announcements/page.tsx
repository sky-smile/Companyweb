import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AnnouncementListClient } from './AnnouncementListClient';

export const metadata: Metadata = buildMetadata({
  title: '公告中心',
  description: '查看企业公告、官方通知与置顶信息。',
  path: '/announcements',
});

export default function AnnouncementListPage() {
  return <AnnouncementListClient />;
}
