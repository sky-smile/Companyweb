'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { Pagination } from '@/components/Pagination';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import styles from '../list.module.css';

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
      <section className={styles.hero}>
        <div className={`${styles.heroDeco} ${styles.heroDecoPrimary}`} />
        <div className={`${styles.heroDeco} ${styles.heroDecoSecondary}`} />
        <div className={`${styles.heroDeco} ${styles.heroDecoTertiary}`} />

        <div className={`site-shell ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeText}>Announcements</span>
          </div>
          <h1 className={styles.heroTitle}>公告中心</h1>
          <p className={styles.heroDesc}>
            查看企业公告、官方通知与置顶信息，掌握重要变更与最新政策。
          </p>
        </div>
      </section>

      {/* 公告列表 */}
      <section className={`site-shell ${styles.listSection}`}>
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
            <div className={styles.listItems}>
              {paginatedAnnouncements.map((item) => (
                <Link key={item.id} href={`/announcements/${item.id}`} className={styles.item}>
                  <div className={styles.itemMeta}>
                    {!!item.isTop && (
                      <span className={styles.pinBadge}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1l1.5 3.5L11 5l-2.5 2.5L9 11 6 9 3 11l.5-3.5L1 5l3.5-.5L6 1z" fill="currentColor"/>
                        </svg>
                        置顶
                      </span>
                    )}
                    <time className={styles.itemDate}>{formatPublicDate(item.publishedAt)}</time>
                  </div>
                  <h2 className={styles.itemTitle}>{item.title}</h2>
                  <p className={styles.itemSummary}>
                    {item.summary || '公告摘要待补充。'}
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
              total={total || announcements.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </>
  );
}
