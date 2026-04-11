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
      <section style={{
        position: 'relative',
        padding: '80px 0 48px',
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
          {/* 面包屑 */}
          <nav style={{ fontSize: 14, color: 'rgba(15, 23, 42, 0.5)', marginBottom: 28 }}>
            <Link href="/" style={{ color: 'rgba(15, 23, 42, 0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>首页</Link>
            <span style={{ margin: '0 10px' }}>/</span>
            <span style={{ color: 'var(--brand)', fontWeight: 500 }}>公告中心</span>
          </nav>

          <div style={{ maxWidth: 700 }}>
            <div style={{
              color: 'var(--brand)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
            }}>
              Announcements
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
            }}>
              公告中心
            </h1>
            <p className="section-copy" style={{ marginTop: 16, maxWidth: 560 }}>
              查看企业公告、官方通知与置顶信息，掌握重要变更与最新政策。
            </p>
          </div>
        </div>
      </section>

      {/* 公告列表 */}
      <section className="site-shell" style={{ padding: '48px 0' }}>
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
            <div style={{ display: 'grid', gap: 0 }}>
              {paginatedAnnouncements.map((item) => (
                <Link key={item.id} href={`/announcements/${item.id}`} style={{
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13, color: 'var(--brand)', fontWeight: 500 }}>
                    {item.isTop && (
                      <span style={{
                        background: 'var(--brand)',
                        color: '#fff',
                        padding: '1px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                      }}>
                        置顶
                      </span>
                    )}
                    <span>{formatPublicDate(item.publishedAt)}</span>
                  </div>
                  <div style={{ fontSize: 20, marginBottom: 10, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>{item.title}</div>
                  <div className="section-copy" style={{ fontSize: 15, lineHeight: 1.7 }}>{item.summary || '公告摘要待补充。'}</div>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .site-shell a[href^="/announcements/"]:hover {
          background: var(--brand-soft) !important;
        }
      `}} />
    </>
  );
}
