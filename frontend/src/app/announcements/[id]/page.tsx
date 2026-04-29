import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { RichContent } from '@/components/RichContent';
import styles from '@/app/list.module.css';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await publicService.getAnnouncementDetail(id);
    return {
      title: item.title,
      description: item.summary || undefined,
    };
  } catch {
    return { title: '公告详情' };
  }
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let item;
  try {
    item = await publicService.getAnnouncementDetail(id);
  } catch {
    notFound();
  }

  return (
    <>
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
          <div className={styles.detailContent}>
            <div className={styles.detailMeta}>
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

            <h1 className={styles.detailTitle}>{item.title}</h1>

            {item.summary && (
              <p className={`${styles.detailSummary} ${styles.detailSummaryDanger}`}>{item.summary}</p>
            )}

            <div className={styles.detailDivider} />

            <div className={styles.detailBody}>
              <RichContent
                content={item.content}
                fallback="公告正文待补充。"
              />
            </div>

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
