'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { Pagination } from '@/components/Pagination';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';

const PAGE_SIZE = 10;

export function NewsListClient() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await publicService.getNewsList();
        setNews(data.list || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedNews = news.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      {/* 页面头部 Hero */}
      <section className="page-hero">
        {/* 背景装饰 */}
        <div className="hero-background-decoration" />
        
        <div className="site-shell hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">News</div>
            <h1 className="hero-title">新闻中心</h1>
            <p className="hero-description">
              获取企业最新动态、行业资讯与业务进展，洞察发展趋势。
            </p>
          </div>
        </div>
      </section>

      {/* 新闻列表 */}
      <section className="site-shell news-list-section">
        {loading ? (
          <ListSkeleton count={5} />
        ) : news.length === 0 ? (
          <EmptyState
            title="暂无新闻"
            description="当前还没有发布的新闻，请稍后再查看。"
            actionHref="/"
            actionLabel="返回首页"
          />
        ) : (
          <>
            <div className="news-list">
              {paginatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="news-item">
                  {/* 新闻元信息 */}
                  <div className="news-item-meta">
                    <span className="news-category-badge">{item.categoryName || '新闻'}</span>
                    <time className="news-date">{formatPublicDate(item.publishedAt)}</time>
                  </div>
                  
                  {/* 新闻标题 */}
                  <h2 className="news-item-title">{item.title}</h2>
                  
                  {/* 新闻摘要 */}
                  <p className="news-item-summary">
                    {item.summary || '新闻摘要待补充。'}
                  </p>
                  
                  {/* 阅读更多提示 */}
                  <div className="news-item-cta">
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
              total={total || news.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      {/* 样式 */}
      <style jsx>{`
        /* ========== 页面头部 Hero ========== */
        .page-hero {
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

        /* ========== 新闻列表区域 ========== */
        .news-list-section {
          padding-top: 72px;
          padding-bottom: 72px;
        }

        .news-list {
          display: grid;
          gap: 0;
        }

        /* ========== 新闻条目 ========== */
        .news-item {
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

        .news-item::before {
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

        .news-item:hover {
          background: var(--brand-soft);
        }

        .news-item:hover::before {
          transform: scaleY(1);
        }

        /* 新闻元信息 */
        .news-item-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .news-category-badge {
          display: inline-block;
          padding: 4px 12px;
          background: var(--brand-soft);
          color: var(--brand);
          font-weight: 600;
          border-radius: 20px;
          font-size: 12px;
          letter-spacing: 0.02em;
        }

        .news-date {
          color: var(--text-muted);
          font-size: 13px;
        }

        /* 新闻标题 */
        .news-item-title {
          margin: 0 0 12px;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.4;
          color: var(--foreground);
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }

        .news-item:hover .news-item-title {
          color: var(--brand);
        }

        /* 新闻摘要 */
        .news-item-summary {
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
        .news-item-cta {
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

        .news-item:hover .news-item-cta {
          opacity: 1;
          transform: translateX(0);
        }

        .news-item-cta svg {
          transition: transform 0.3s ease;
        }

        .news-item:hover .news-item-cta svg {
          transform: translateX(4px);
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 768px) {
          .page-hero {
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

          .news-list-section {
            padding-top: 48px;
            padding-bottom: 48px;
          }

          .news-item {
            padding: 24px 16px;
          }

          .news-item-title {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .news-item-summary {
            font-size: 14px;
            -webkit-line-clamp: 3;
          }

          .news-item-meta {
            font-size: 12px;
            margin-bottom: 10px;
          }

          .news-category-badge {
            font-size: 11px;
            padding: 3px 10px;
          }

          .news-item-cta {
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

          .news-item {
            padding: 20px 12px;
          }

          .news-item-title {
            font-size: 17px;
            line-height: 1.35;
          }
        }
      `}</style>
    </>
  );
}
