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
      <section className="page-hero" style={{
        position: 'relative',
        paddingTop: 'var(--page-top, 108px)',
        paddingBottom: 48,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div className="site-shell" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{
              color: 'var(--brand)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
            }}>
              News
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
            }}>
              新闻中心
            </h1>
            <p className="section-copy" style={{ marginTop: 16, maxWidth: 560 }}>
              获取企业最新动态、行业资讯与业务进展，洞察发展趋势。
            </p>
          </div>
        </div>
      </section>

      {/* 新闻列表 */}
      <section className="site-shell page-content-end" style={{ paddingTop: 64 }}>
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
            <div style={{ display: 'grid', gap: 0 }}>
              {paginatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} style={{
                  display: 'block',
                  padding: '28px 0',
                  borderBottom: '1px solid var(--line)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.3s ease',
                  margin: '0 -12px',
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderRadius: 8,
                }}>
                  <div style={{ color: 'var(--brand)', marginBottom: 10, fontSize: 13, fontWeight: 500 }}>
                    {item.categoryName || '新闻'} · {formatPublicDate(item.publishedAt)}
                  </div>
                  <div style={{ fontSize: 20, marginBottom: 10, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>{item.title}</div>
                  <div className="section-copy" style={{ fontSize: 15, lineHeight: 1.7 }}>{item.summary || '新闻摘要待补充。'}</div>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .site-shell a[href^="/news/"]:hover {
          background: var(--brand-soft) !important;
        }
      `}} />
    </>
  );
}
