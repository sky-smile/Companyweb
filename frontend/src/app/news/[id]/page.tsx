import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RichContent } from '@/components/RichContent';
import { NewsArticleJsonLd } from '@/components/JsonLd';

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
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: '首页', href: '/' },
            { label: '新闻中心', href: '/news' },
            { label: item.title },
          ]}
        />

        <article className="site-card" style={{ padding: 36 }}>
          {/* 分类和日期 */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13, color: 'var(--brand)', flexWrap: 'wrap' }}>
            <span>{item.categoryName || '新闻'}</span>
            <span>·</span>
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
            fallback="新闻正文待补充。"
            style={{ marginTop: 24 }}
          />
        </article>

        {/* JSON-LD 结构化数据 */}
        <NewsArticleJsonLd
          headline={item.title}
          description={item.summary || item.content}
          datePublished={item.publishedAt || new Date().toISOString()}
          image={item.coverImage || undefined}
        />
      </section>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
