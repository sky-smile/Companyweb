'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { RichContent } from '@/components/RichContent';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await publicService.getAnnouncementDetail(id);
        setItem(data);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError('公告不存在或尚未发布。');
          } else if (err.status === 0) {
            setError(err.message || '无法连接到服务器，请检查网络或后端服务。');
          } else {
            setError(err.message || '加载失败，请稍后重试。');
          }
        } else {
          setError('加载失败，请稍后重试。');
        }
        console.error('Failed to fetch announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
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
          description="当前公告可能已下线或尚未发布。"
          actionHref="/"
          actionLabel="返回首页"
        />
      </section>
    );
  }

  return (
    <section className="site-shell page-detail page-content-end-compact announcement-detail-page">
      <article className="announcement-detail-article">
        {/* 面包屑导航 */}
        <Breadcrumb items={[
          { label: '首页', href: '/' },
          { label: '公告中心', href: '/announcements' },
          { label: item.title },
        ]} />

        {/* 内容区域 */}
        <div className="announcement-content-wrapper">
          {/* 元信息 */}
          <div className="announcement-meta">
            {/* 置顶标记 */}
            {item.isTop && (
              <span className="announcement-pin-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1l1.5 3.5L11 5l-2.5 2.5L9 11 6 9 3 11l.5-3.5L1 5l3.5-.5L6 1z" fill="currentColor"/>
                </svg>
                置顶
              </span>
            )}
            <time className="announcement-date">{formatPublicDate(item.publishedAt)}</time>
          </div>

          {/* 标题 */}
          <h1 className="announcement-detail-title">{item.title}</h1>

          {/* 摘要 */}
          {item.summary && (
            <p className="announcement-detail-summary">{item.summary}</p>
          )}

          {/* 分隔线 */}
          <div className="announcement-divider" />

          {/* 富文本内容 */}
          <div className="announcement-detail-body">
            <RichContent
              content={item.content}
              fallback="公告正文待补充。"
            />
          </div>

          {/* 底部标签区域 */}
          <div className="announcement-footer">
            <div className="announcement-tags">
              <span className="announcement-tag-label">类型：</span>
              <span className="announcement-tag">
                {item.isTop ? '置顶公告' : '公告'}
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* 样式 */}
      <style jsx>{`
        /* ========== 页面容器 ========== */
        .announcement-detail-page {
          padding-top: var(--page-top-detail, 100px);
          padding-bottom: 80px;
        }

        /* ========== 文章卡片 ========== */
        .announcement-detail-article {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
          transition: box-shadow 0.3s ease;
        }

        .announcement-detail-article:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        /* ========== 内容区域 ========== */
        .announcement-content-wrapper {
          padding: 48px 56px;
        }

        /* ========== 元信息 ========== */
        .announcement-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .announcement-pin-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .announcement-pin-badge svg {
          width: 12px;
          height: 12px;
        }

        .announcement-date {
          color: var(--text-muted);
          font-size: 14px;
        }

        /* ========== 标题 ========== */
        .announcement-detail-title {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--foreground);
          margin: 0 0 20px;
          letter-spacing: -0.02em;
        }

        /* ========== 摘要 ========== */
        .announcement-detail-summary {
          font-size: 17px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin: 0 0 32px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #fef3f2 0%, #ffffff 100%);
          border-left: 4px solid #ef4444;
          border-radius: 0 12px 12px 0;
        }

        /* ========== 分隔线 ========== */
        .announcement-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--line), transparent);
          margin: 32px 0;
        }

        /* ========== 正文内容 ========== */
        .announcement-detail-body {
          line-height: 1.9;
          color: var(--foreground);
          font-size: 16px;
        }

        .announcement-detail-body :global(p) {
          margin: 0 0 1.6em;
          line-height: 1.9;
        }

        .announcement-detail-body :global(h2) {
          margin: 40px 0 20px;
          font-weight: 700;
          font-size: 24px;
          line-height: 1.4;
          color: var(--foreground);
        }

        .announcement-detail-body :global(h3) {
          margin: 32px 0 16px;
          font-weight: 600;
          font-size: 20px;
          line-height: 1.4;
          color: var(--foreground);
        }

        .announcement-detail-body :global(ul),
        .announcement-detail-body :global(ol) {
          margin: 16px 0;
          padding-left: 28px;
        }

        .announcement-detail-body :global(li) {
          margin: 8px 0;
          line-height: 1.8;
        }

        .announcement-detail-body :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px 0;
          display: block;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        /* ========== 底部标签区域 ========== */
        .announcement-footer {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--line);
        }

        .announcement-tags {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .announcement-tag-label {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .announcement-tag {
          display: inline-block;
          padding: 6px 14px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          color: #dc2626;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .announcement-tag:hover {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15));
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 1024px) {
          .announcement-content-wrapper {
            padding: 40px 40px;
          }

          .announcement-detail-title {
            font-size: 28px;
          }
        }

        @media (max-width: 768px) {
          .announcement-detail-page {
            padding-top: var(--page-top-detail, 88px);
            padding-bottom: 60px;
          }

          .announcement-detail-article {
            border-radius: 0;
            box-shadow: none;
          }

          .announcement-detail-article:hover {
            box-shadow: none;
          }

          .announcement-content-wrapper {
            padding: 32px 24px;
          }

          .announcement-meta {
            margin-bottom: 16px;
          }

          .announcement-detail-title {
            font-size: 24px;
            margin-bottom: 16px;
          }

          .announcement-detail-summary {
            font-size: 15px;
            padding: 16px 20px;
            margin-bottom: 24px;
          }

          .announcement-divider {
            margin: 24px 0;
          }

          .announcement-detail-body {
            font-size: 15px;
          }

          .announcement-detail-body :global(h2) {
            font-size: 20px;
            margin: 28px 0 16px;
          }

          .announcement-detail-body :global(h3) {
            font-size: 18px;
            margin: 24px 0 12px;
          }

          .announcement-footer {
            margin-top: 32px;
            padding-top: 24px;
          }

          .announcement-tag-label {
            font-size: 13px;
          }

          .announcement-tag {
            font-size: 12px;
            padding: 5px 12px;
          }
        }

        @media (max-width: 480px) {
          .announcement-content-wrapper {
            padding: 24px 16px;
          }

          .announcement-detail-title {
            font-size: 20px;
            line-height: 1.4;
          }

          .announcement-meta {
            font-size: 13px;
          }

          .announcement-detail-summary {
            font-size: 14px;
            padding: 14px 16px;
          }

          .announcement-detail-body {
            font-size: 14px;
            line-height: 1.8;
          }
        }
      `}</style>
    </section>
  );
}
