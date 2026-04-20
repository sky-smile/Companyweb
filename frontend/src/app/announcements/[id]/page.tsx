'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { RichContent } from '@/components/RichContent';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import styles from '@/app/list.module.css';

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
      <section className={`site-shell page-detail page-content-end-compact ${styles.detailPage}`} style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
        <div className="site-card" style={{ padding: 36 }}>
          <ListSkeleton count={1} />
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className={`site-shell page-detail page-content-end-compact ${styles.detailPage}`} style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
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
    <>
      {/* 顶部面包屑导航 */}
      <div className={styles.detailBreadcrumb}>
        <div className={`site-shell ${styles.detailBreadcrumbInner}`}>
          <Link href="/" className={styles.detailBreadcrumbLink}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 6.5L7 2L12 6.5V12.5C12 12.8 11.8 13 11.5 13H2.5C2.2 13 2 12.8 2 12.5V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 13V8.5H9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>首页</span>
          </Link>
          <span className={styles.detailBreadcrumbSeparator}>/</span>
          <Link href="/announcements" className={styles.detailBreadcrumbLink}>
            <span>公告中心</span>
          </Link>
          <span className={styles.detailBreadcrumbSeparator}>/</span>
          <span className={styles.detailBreadcrumbCurrent}>{item.title}</span>
        </div>
      </div>

      <section className={`site-shell page-detail page-content-end-compact ${styles.detailPage}`}>
        <article className={styles.detailArticle}>
          {/* 内容区域 */}
          <div className={styles.detailContent}>
            {/* 元信息 */}
            <div className={styles.detailMeta}>
              {/* 置顶标记 */}
              {!!item.isTop && (
                <span className={`${styles.detailBadge} ${styles.detailBadgeDanger}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1l1.5 3.5L11 5l-2.5 2.5L9 11 6 9 3 11l.5-3.5L1 5l3.5-.5L6 1z" fill="currentColor"/>
                  </svg>
                  置顶
                </span>
              )}
              <time className={styles.detailDate}>{formatPublicDate(item.publishedAt)}</time>
            </div>

            {/* 标题 */}
            <h1 className={styles.detailTitle}>{item.title}</h1>

            {/* 摘要 */}
            {item.summary && (
              <p className={`${styles.detailSummary} ${styles.detailSummaryDanger}`}>{item.summary}</p>
            )}

            {/* 分隔线 */}
            <div className={styles.detailDivider} />

            {/* 富文本内容 */}
            <div className={styles.detailBody}>
              <RichContent
                content={item.content}
                fallback="公告正文待补充。"
              />
            </div>

            {/* 底部标签区域 */}
            <div className={styles.detailFooter}>
              <div className={styles.detailTags}>
                <span className={styles.detailTagLabel}>类型：</span>
                <span className={`${styles.detailTag} ${styles.detailTagDanger}`}>
                  {!!item.isTop ? '置顶公告' : '公告'}
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
