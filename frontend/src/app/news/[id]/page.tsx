import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const item = await publicService.getNewsDetail(id);

    return buildMetadata({
      title: item.title,
      description: pickDescription(item.summary, item.content),
      path: `/news/${id}`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return buildMetadata({
        title: '新闻不存在',
        description: '当前新闻内容不存在或尚未发布。',
        path: `/news/${id}`,
      });
    }

    throw error;
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const item = await publicService.getNewsDetail(id);

    return (
      <section className="site-shell" style={{ padding: '42px 0' }}>
        <article className="site-card" style={{ padding: 36 }}>
          <div style={{ color: 'var(--brand)', marginBottom: 10 }}>
            {item.categoryName || '新闻'} · {formatPublicDate(item.publishedAt)}
          </div>
          <h1 className="section-title">{item.title}</h1>
          <p className="section-copy" style={{ marginTop: 18 }}>{item.summary || '新闻摘要待补充。'}</p>
          <div style={{ marginTop: 24, whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>
            {item.content || '新闻正文待补充。'}
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
