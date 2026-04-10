import type { Metadata } from 'next';
import Link from 'next/link';
import { formatPublicDate } from '@/lib/public-content';
import { buildMetadata } from '@/lib/seo';
import { publicService } from '@/services/public-service';

export const metadata: Metadata = buildMetadata({
  title: '公告中心',
  description: '查看企业公告、官方通知与置顶信息。',
  path: '/announcements',
});

export default async function AnnouncementListPage() {
  const items = await publicService.getAnnouncements();

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">公告</h1>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {items.list.length === 0 ? <div className="section-copy">暂无已发布公告。</div> : null}
          {items.list.map((item) => (
            <Link key={item.id} href={`/announcements/${item.id}`} style={{ paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
              <div style={{ color: 'var(--brand)', marginBottom: 8 }}>
                {item.isTop ? '置顶公告 · ' : ''}
                {formatPublicDate(item.publishedAt)}
              </div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.title}</div>
              <div className="section-copy">{item.summary || '公告摘要待补充。'}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
