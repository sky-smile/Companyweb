import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RichContent } from '@/components/RichContent';

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
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: '首页', href: '/' },
            { label: '公告', href: '/announcements' },
            { label: item.title },
          ]}
        />

        <article className="site-card" style={{ padding: 36 }}>
          {/* 置顶标记和日期 */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13, color: 'var(--brand)', flexWrap: 'wrap', alignItems: 'center' }}>
            {item.isTop && <span style={{ background: 'var(--brand)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>置顶</span>}
            <span>{formatPublicDate(item.publishedAt)}</span>
          </div>

          {/* 标题 */}
          <h1 className="section-title" style={{ marginBottom: 20 }}>{item.title}</h1>

          {/* 摘要 */}
          {item.summary && (
            <p className="section-copy" style={{ marginTop: 0, marginBottom: 24, fontSize: 16, fontWeight: 500 }}>
              {item.summary}
            </p>
          )}

          {/* 富文本内容 */}
          <RichContent
            content={item.content}
            fallback="公告正文待补充。"
            style={{ marginTop: 24 }}
          />
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
