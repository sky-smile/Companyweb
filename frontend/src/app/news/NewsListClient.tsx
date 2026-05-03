'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import type { NewsItem } from '@/types/public';
import { Pagination } from '@/components/Pagination';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import styles from '../list.module.css';

const PAGE_SIZE = 10;

export function NewsListClient() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await publicService.getNewsList({ page: currentPage, pageSize: PAGE_SIZE });
        setNews(data.list || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 页面头部 Hero */}
      <section className={styles.hero}>
        <div className={`${styles.heroDeco} ${styles.heroDecoPrimary}`} />
        <div className={`${styles.heroDeco} ${styles.heroDecoSecondary}`} />
        <div className={`${styles.heroDeco} ${styles.heroDecoTertiary}`} />

        <div className={`site-shell ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeText}>News</span>
          </div>
          <h1 className={styles.heroTitle}>新闻中心</h1>
          <p className={styles.heroDesc}>
            获取企业最新动态、行业资讯与业务进展，洞察发展趋势。
          </p>
        </div>
      </section>

      {/* 新闻列表 */}
      <section className={`site-shell ${styles.listSection}`}>
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
            <div className={styles.listItems}>
              {news.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className={styles.item}>
                  <div className={styles.itemMeta}>
                    <span className={styles.categoryBadge}>{item.categoryName || '新闻'}</span>
                    <time className={styles.itemDate}>{formatPublicDate(item.publishedAt)}</time>
                  </div>
                  <h2 className={styles.itemTitle}>{item.title}</h2>
                  <p className={styles.itemSummary}>
                    {item.summary || '新闻摘要待补充。'}
                  </p>
                  <div className={styles.itemCta}>
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
              total={total}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </>
  );
}
