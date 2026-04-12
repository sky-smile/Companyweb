'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { Pagination } from '@/components/Pagination';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';

const PAGE_SIZE = 10;

export function AnnouncementListClient() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const data = await publicService.getAnnouncements();
        setAnnouncements(data.list || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedAnnouncements = announcements.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      {/* 页面头部 Hero */}
      <section className="page-hero announcements-hero">
        {/* 背景装饰 */}
        <div className="hero-background-decoration" />
        
        <div className="site-shell hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">Announcements</div>
            <h1 className="hero-title">公告中心</h1>
            <p className="hero-description">
              查看企业公告、官方通知与置顶信息，掌握重要变更与最新政策。
            </p>
          </div>
        </div>
      </section>

      {/* 公告列表 */}
      <section className="site-shell announcements-list-section">
        {loading ? (
          <ListSkeleton count={5} />
        ) : announcements.length === 0 ? (
          <EmptyState
            title="暂无公告"
            description="当前还没有发布的公告，请稍后再查看。"
            actionHref="/"
            actionLabel="返回首页"
          />
        ) : (
          <>
            <div className="announcements-list">
              {paginatedAnnouncements.map((item) => (
                <Link key={item.id} href={`/announcements/${item.id}`} className="announcement-item">
                  {/* 公告元信息 */}
                  <div className="announcement-item-meta">
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
                  
                  {/* 公告标题 */}
                  <h2 className="announcement-item-title">{item.title}</h2>
                  
                  {/* 公告摘要 */}
                  <p className="announcement-item-summary">
                    {item.summary || '公告摘要待补充。'}
                  </p>
                  
                  {/* 阅读更多 CTA */}
                  <div className="announcement-item-cta">
                    <span>阅读全文</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              total={total || announcements.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      {/* 样式 */}
      <style jsx>{`
        /* ========== 页面头部 Hero ========== */
        .announcements-hero {
          position: relative;
          padding-top: var(--page-top, 108px);
          padding-bottom: 56px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 50%, #ffffff 100%);
          border-bottom: 1px solid var(--line);
        }

        .hero-background-decoration {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-text {
          max-width: 700px;
        }

        .hero-eyebrow {
          color: var(--brand);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.25rem, 5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }

        .hero-description {
          margin-top: 18px;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 600px;
        }

        /* ========== 公告列表区域 ========== */
        .announcements-list-section {
          padding-top: 72px;
          padding-bottom: 72px;
        }

        .announcements-list {
          display: grid;
          gap: 0;
        }

        /* ========== 公告条目 ========== */
        .announcement-item {
          display: block;
          padding: 32px 24px;
          border-bottom: 1px solid var(--line);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 -12px;
          border-radius: 12px;
          position: relative;
        }

        .announcement-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--brand);
          transform: scaleY(0);
          transition: transform 0.3s ease;
          border-radius: 2px;
        }

        .announcement-item:hover {
          background: var(--brand-soft);
        }

        .announcement-item:hover::before {
          transform: scaleY(1);
        }

        /* 公告元信息 */
        .announcement-item-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
          flex-wrap: wrap;
        }

        .announcement-pin-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .announcement-pin-badge svg {
          width: 12px;
          height: 12px;
        }

        .announcement-date {
          color: var(--text-muted);
          font-size: 13px;
        }

        /* 公告标题 */
        .announcement-item-title {
          margin: 0 0 12px;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.4;
          color: var(--foreground);
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }

        .announcement-item:hover .announcement-item-title {
          color: var(--brand);
        }

        /* 公告摘要 */
        .announcement-item-summary {
          margin: 0 0 16px;
          font-size: 15px;
          line-height: 1.75;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* 阅读更多 CTA */
        .announcement-item-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--brand);
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s ease;
        }

        .announcement-item:hover .announcement-item-cta {
          opacity: 1;
          transform: translateX(0);
        }

        .announcement-item-cta svg {
          transition: transform 0.3s ease;
        }

        .announcement-item:hover .announcement-item-cta svg {
          transform: translateX(4px);
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 768px) {
          .announcements-hero {
            padding-top: var(--page-top, 96px);
            padding-bottom: 48px;
          }

          .hero-background-decoration {
            width: 350px;
            height: 350px;
            top: -15%;
            right: -15%;
          }

          .hero-title {
            font-size: clamp(1.75rem, 6vw, 2.25rem);
          }

          .hero-description {
            font-size: 15px;
            margin-top: 14px;
          }

          .announcements-list-section {
            padding-top: 48px;
            padding-bottom: 48px;
          }

          .announcement-item {
            padding: 24px 16px;
          }

          .announcement-item-title {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .announcement-item-summary {
            font-size: 14px;
            -webkit-line-clamp: 3;
          }

          .announcement-item-meta {
            font-size: 12px;
            margin-bottom: 10px;
          }

          .announcement-pin-badge {
            font-size: 10px;
            padding: 2px 8px;
          }

          .announcement-item-cta {
            opacity: 1;
            transform: translateX(0);
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .hero-eyebrow {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .hero-description {
            font-size: 14px;
            line-height: 1.6;
          }

          .announcement-item {
            padding: 20px 12px;
          }

          .announcement-item-title {
            font-size: 17px;
            line-height: 1.35;
          }
        }
      `}</style>
    </>
  );
}
