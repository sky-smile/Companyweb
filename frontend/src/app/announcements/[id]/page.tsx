import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await publicService.getAnnouncementDetail(id);

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <article className="site-card" style={{ padding: 36 }}>
        <div style={{ color: 'var(--brand)', marginBottom: 10 }}>
          {item.isTop ? '置顶公告 · ' : ''}
          {formatPublicDate(item.publishedAt)}
        </div>
        <h1 className="section-title">{item.title}</h1>
        <p className="section-copy" style={{ marginTop: 18 }}>{item.summary || '公告摘要待补充。'}</p>
        <div style={{ marginTop: 24, whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>
          {item.content || '公告正文待补充。'}
        </div>
      </article>
    </section>
  );
}
