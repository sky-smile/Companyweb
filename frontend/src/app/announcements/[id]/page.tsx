import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const item = await publicService.getAnnouncementDetail(id);

    return buildMetadata({
      title: item.title,
      description: pickDescription(item.summary, item.content),
      path: `/announcements/${id}`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return buildMetadata({
        title: '公告不存在',
        description: '当前公告不存在或尚未发布。',
        path: `/announcements/${id}`,
      });
    }

    throw error;
  }
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
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
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
