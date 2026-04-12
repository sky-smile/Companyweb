'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { LazyImage } from '@/components/LazyImage';
import { RichContent } from '@/components/RichContent';
import { NewsArticleJsonLd, BreadcrumbListJsonLd } from '@/components/JsonLd';
import { Breadcrumb } from '@/components/Breadcrumb';
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
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError('新闻不存在或尚未发布。');
          } else if (err.status === 0) {
            setError(err.message || '无法连接到服务器，请检查网络或后端服务。');
          } else {
            setError(err.message || '加载失败，请稍后重试。');
          }
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
    <section className="site-shell page-detail page-content-end-compact news-detail-page">
      <article className="news-detail-article">
        {/* 面包屑导航 */}
        <Breadcrumb items={[
          { label: '首页', href: '/' },
          { label: '新闻中心', href: '/news' },
          { label: item.title },
        ]} />

        {/* 封面图片 */}
        {item.coverImage && (
          <div className="news-cover-wrapper">
            <LazyImage
              src={item.coverImage}
              alt={item.title}
              height={450}
              borderRadius={0}
            />
            {/* 图片遮罩 */}
            <div className="news-cover-overlay" />
          </div>
        )}

        {/* 内容区域 */}
        <div className="news-content-wrapper">
          {/* 分类和日期 */}
          <div className="news-meta">
            <span className="news-category">{item.categoryName || '新闻'}</span>
            <span className="news-separator">·</span>
            <time className="news-date">{formatPublicDate(item.publishedAt)}</time>
          </div>

          {/* 标题 */}
          <h1 className="news-detail-title">{item.title}</h1>

          {/* 摘要 */}
          {item.summary && (
            <p className="news-detail-summary">{item.summary}</p>
          )}

          {/* 分隔线 */}
          <div className="news-divider" />

          {/* 富文本内容 */}
          <div className="news-detail-body">
            <RichContent
              content={item.content}
              fallback="新闻正文待补充。"
            />
          </div>

          {/* 底部标签区域 */}
          <div className="news-footer">
            <div className="news-tags">
              <span className="news-tag-label">分类：</span>
              <span className="news-tag">{item.categoryName || '新闻'}</span>
            </div>
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

      {/* 面包屑 JSON-LD */}
      <BreadcrumbListJsonLd items={[
        { name: '首页', url: 'http://localhost:3001/' },
        { name: '新闻中心', url: 'http://localhost:3001/news' },
        { name: item.title },
      ]} />

      {/* 样式 */}
      <style jsx>{`
        /* ========== 页面容器 ========== */
        .news-detail-page {
          padding-top: var(--page-top-detail, 100px);
          padding-bottom: 80px;
        }

        /* ========== 文章卡片 ========== */
        .news-detail-article {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
          transition: box-shadow 0.3s ease;
        }

        .news-detail-article:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        /* ========== 封面图片 ========== */
        .news-cover-wrapper {
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .news-cover-wrapper :global(.lazy-image-shimmer) {
          border-radius: 0;
          display: block;
        }

        .news-cover-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.03), transparent);
          pointer-events: none;
        }

        /* ========== 内容区域 ========== */
        .news-content-wrapper {
          padding: 48px 56px;
        }

        /* ========== 元信息 ========== */
        .news-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .news-category {
          color: var(--brand);
          font-weight: 600;
          padding: 6px 14px;
          background: var(--brand-soft);
          border-radius: 20px;
          font-size: 13px;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
        }

        .news-category:hover {
          background: rgba(37, 99, 235, 0.12);
        }

        .news-separator {
          color: var(--text-muted);
          font-size: 12px;
        }

        .news-date {
          color: var(--text-muted);
          font-size: 14px;
        }

        /* ========== 标题 ========== */
        .news-detail-title {
          font-size: 34px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--foreground);
          margin: 0 0 24px;
          letter-spacing: -0.02em;
        }

        /* ========== 摘要 ========== */
        .news-detail-summary {
          font-size: 17px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin: 0 0 36px;
          padding: 24px 28px;
          background: linear-gradient(135deg, #f8fafc 0%, #f0f7ff 100%);
          border-left: 4px solid var(--brand);
          border-radius: 0 12px 12px 0;
          font-weight: 400;
        }

        /* ========== 分隔线 ========== */
        .news-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--line), transparent);
          margin: 36px 0;
        }

        /* ========== 正文内容 ========== */
        .news-detail-body {
          line-height: 1.9;
          color: var(--foreground);
          font-size: 16px;
        }

        .news-detail-body :global(p) {
          margin: 0 0 1.6em;
          line-height: 1.9;
        }

        .news-detail-body :global(strong) {
          font-weight: 600;
          color: var(--foreground);
        }

        /* 富文本内容中的图片样式 */
        .news-detail-body :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 28px 0;
          display: block;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .news-detail-body :global(h2) {
          margin: 40px 0 20px;
          font-weight: 700;
          font-size: 26px;
          line-height: 1.4;
          color: var(--foreground);
          letter-spacing: -0.01em;
        }

        .news-detail-body :global(h3) {
          margin: 32px 0 16px;
          font-weight: 600;
          font-size: 22px;
          line-height: 1.4;
          color: var(--foreground);
        }

        .news-detail-body :global(h4) {
          margin: 28px 0 14px;
          font-weight: 600;
          font-size: 18px;
          line-height: 1.4;
          color: var(--foreground);
        }

        .news-detail-body :global(ul),
        .news-detail-body :global(ol) {
          margin: 18px 0;
          padding-left: 28px;
        }

        .news-detail-body :global(li) {
          margin: 10px 0;
          line-height: 1.8;
        }

        .news-detail-body :global(blockquote) {
          margin: 24px 0;
          padding: 16px 24px;
          background: var(--surface);
          border-left: 4px solid var(--brand);
          border-radius: 0 8px 8px 0;
          color: var(--text-secondary);
          font-style: italic;
        }

        .news-detail-body :global(a) {
          color: var(--brand);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }

        .news-detail-body :global(a:hover) {
          color: var(--brand-light);
        }

        .news-detail-body :global(code) {
          background: var(--surface);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: 'Courier New', monospace;
        }

        .news-detail-body :global(pre) {
          background: #1e293b;
          color: #e2e8f0;
          padding: 20px 24px;
          border-radius: 10px;
          overflow-x: auto;
          margin: 24px 0;
        }

        .news-detail-body :global(pre code) {
          background: none;
          padding: 0;
          color: inherit;
        }

        /* ========== 底部标签区域 ========== */
        .news-footer {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--line);
        }

        .news-tags {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .news-tag-label {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .news-tag {
          display: inline-block;
          padding: 6px 14px;
          background: var(--brand-soft);
          color: var(--brand);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .news-tag:hover {
          background: rgba(37, 99, 235, 0.12);
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 1024px) {
          .news-content-wrapper {
            padding: 40px 40px;
          }

          .news-detail-title {
            font-size: 30px;
          }
        }

        @media (max-width: 768px) {
          .news-detail-page {
            padding-top: var(--page-top-detail, 88px);
            padding-bottom: 60px;
          }

          .news-detail-article {
            border-radius: 0;
            box-shadow: none;
          }

          .news-detail-article:hover {
            box-shadow: none;
          }

          .news-cover-wrapper :global(.lazy-image-shimmer) {
            border-radius: 0;
          }

          .news-content-wrapper {
            padding: 32px 24px;
          }

          .news-meta {
            margin-bottom: 16px;
          }

          .news-category {
            font-size: 12px;
            padding: 5px 12px;
          }

          .news-detail-title {
            font-size: 26px;
            margin-bottom: 20px;
            line-height: 1.35;
          }

          .news-detail-summary {
            font-size: 15px;
            padding: 18px 20px;
            margin-bottom: 28px;
            line-height: 1.7;
          }

          .news-divider {
            margin: 28px 0;
          }

          .news-detail-body {
            font-size: 15px;
          }

          .news-detail-body :global(h2) {
            font-size: 22px;
            margin: 32px 0 16px;
          }

          .news-detail-body :global(h3) {
            font-size: 19px;
            margin: 28px 0 14px;
          }

          .news-detail-body :global(img) {
            margin: 20px 0;
          }

          .news-footer {
            margin-top: 36px;
            padding-top: 24px;
          }

          .news-tag-label {
            font-size: 13px;
          }

          .news-tag {
            font-size: 12px;
            padding: 5px 12px;
          }
        }

        @media (max-width: 480px) {
          .news-content-wrapper {
            padding: 24px 16px;
          }

          .news-detail-title {
            font-size: 22px;
            line-height: 1.4;
          }

          .news-meta {
            font-size: 13px;
            gap: 8px;
          }

          .news-category {
            font-size: 11px;
            padding: 4px 10px;
          }

          .news-date {
            font-size: 13px;
          }

          .news-detail-summary {
            font-size: 14px;
            padding: 16px 16px;
          }

          .news-detail-body {
            font-size: 14px;
            line-height: 1.8;
          }

          .news-detail-body :global(h2) {
            font-size: 20px;
          }

          .news-detail-body :global(h3) {
            font-size: 17px;
          }

          .news-detail-body :global(ul),
          .news-detail-body :global(ol) {
            padding-left: 24px;
          }
        }
      `}</style>
    </section>
  );
}
