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
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">新闻中心</h1>
        
        {loading ? (
          <div style={{ marginTop: 24 }}>
            <ListSkeleton count={5} />
          </div>
        ) : news.length === 0 ? (
          <EmptyState
            title="暂无新闻"
            description="当前还没有发布的新闻，请稍后再查看。"
            actionHref="/"
            actionLabel="返回首页"
          />
        ) : (
          <>
            <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
              {paginatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} style={{ paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
                  <div style={{ color: 'var(--brand)', marginBottom: 8, fontSize: 13 }}>
                    {item.categoryName || '新闻'} · {formatPublicDate(item.publishedAt)}
                  </div>
                  <div style={{ fontSize: 24, marginBottom: 8, fontWeight: 600 }}>{item.title}</div>
                  <div className="section-copy" style={{ fontSize: 15 }}>{item.summary || '新闻摘要待补充。'}</div>
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
      </div>
    </section>
  );
}
