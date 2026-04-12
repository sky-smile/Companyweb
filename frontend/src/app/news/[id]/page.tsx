'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { RichContent } from '@/components/RichContent';
import { NewsArticleJsonLd } from '@/components/JsonLd';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await publicService.getNewsDetail(id);
        setItem(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('新闻不存在或尚未发布。');
        } else {
          setError('加载失败，请稍后重试。');
        }
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <section className="site-shell page-detail" style={{ paddingTop: 'var(--page-top-detail, 100px)', paddingBottom: 24 }}>
        <div className="site-card" style={{ padding: 36 }}>
          <ListSkeleton count={1} />
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="site-shell page-detail" style={{ paddingTop: 'var(--page-top-detail, 100px)', paddingBottom: 24 }}>
        <EmptyState
          title={error || '加载失败'}
          description="当前新闻可能已下线或尚未发布。"
          actionHref="/"
          actionLabel="返回首页"
        />
      </section>
    );
  }

  return (
    <section className="site-shell page-detail" style={{ paddingTop: 'var(--page-top-detail, 100px)', paddingBottom: 24 }}>
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
        description={item.summary || item.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)}
        datePublished={item.publishedAt || new Date().toISOString()}
        image={item.coverImage || undefined}
      />
    </section>
  );
}
