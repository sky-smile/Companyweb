'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
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
      <section className="site-shell page-detail page-content-end-compact" style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
        <div className="site-card" style={{ padding: 36 }}>
          <ListSkeleton count={1} />
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="site-shell page-detail page-content-end-compact" style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
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
    <section className="site-shell page-detail page-content-end-compact" style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
      <article className="news-detail-article">
        {/* 封面图片 */}
        {item.coverImage && (
          <div className="news-cover-image-wrapper">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="news-cover-image"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              onError={(e) => {
                const target = e.currentTarget;
                target.parentElement?.classList.add('news-cover-error');
              }}
            />
            <div className="news-cover-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span>图片加载失败</span>
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <div className="news-content-wrapper">
          {/* 分类和日期 */}
          <div className="news-meta">
            <span className="news-category">{item.categoryName || '新闻'}</span>
            <span className="news-dot">·</span>
            <time className="news-date">{formatPublicDate(item.publishedAt)}</time>
          </div>

          {/* 标题 */}
          <h1 className="news-detail-title">{item.title}</h1>

          {/* 摘要 */}
          {item.summary && (
            <p className="news-detail-summary">{item.summary}</p>
          )}

          {/* 富文本内容 */}
          <div className="news-detail-body">
            <RichContent
              content={item.content}
              fallback="新闻正文待补充。"
            />
          </div>
        </div>
      </article>

      {/* JSON-LD 结构化数据 */}
      <NewsArticleJsonLd
        headline={item.title}
        description={item.summary || item.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)}
        datePublished={item.publishedAt || new Date().toISOString()}
        image={item.coverImage || undefined}
      />

      {/* 样式 */}
      <style jsx>{`
        .news-detail-article {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
        }

        .news-cover-image-wrapper {
          position: relative;
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          overflow: hidden;
        }

        .news-cover-image {
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .news-detail-article:hover .news-cover-image {
          transform: scale(1.03);
        }

        .news-cover-placeholder {
          position: absolute;
          inset: 0;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          gap: 12px;
        }

        .news-cover-error .news-cover-placeholder {
          display: flex;
        }

        .news-cover-error :global(img) {
          display: none;
        }

        .news-content-wrapper {
          padding: 40px 48px;
        }

        .news-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .news-category {
          color: var(--brand);
          font-weight: 600;
          padding: 4px 12px;
          background: var(--brand-soft);
          border-radius: 20px;
        }

        .news-dot {
          color: var(--text-muted);
        }

        .news-date {
          color: var(--text-muted);
        }

        .news-detail-title {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--foreground);
          margin: 0 0 20px;
        }

        .news-detail-summary {
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0 0 32px;
          padding: 20px 24px;
          background: var(--surface);
          border-left: 4px solid var(--brand);
          border-radius: 0 12px 12px 0;
        }

        .news-detail-body {
          line-height: 1.9;
          color: var(--foreground);
        }

        .news-detail-body :global(p) {
          margin: 0 0 1.5em;
        }

        .news-detail-body :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px 0;
          display: block;
        }

        .news-detail-body :global(h2),
        .news-detail-body :global(h3) {
          margin: 32px 0 16px;
          font-weight: 600;
        }

        .news-detail-body :global(ul),
        .news-detail-body :global(ol) {
          margin: 16px 0;
          padding-left: 24px;
        }

        .news-detail-body :global(li) {
          margin: 8px 0;
        }

        /* 响应式适配 */
        @media (max-width: 768px) {
          .news-detail-article {
            border-radius: 0;
            box-shadow: none;
          }

          .news-cover-image-wrapper {
            height: 240px;
          }

          .news-content-wrapper {
            padding: 28px 20px;
          }

          .news-detail-title {
            font-size: 24px;
          }

          .news-detail-summary {
            font-size: 15px;
            padding: 16px 20px;
          }

          .news-meta {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}
