import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { LazyImage } from '@/components/LazyImage';
import { RichContent } from '@/components/RichContent';
import { NewsArticleJsonLd, BreadcrumbListJsonLd } from '@/components/JsonLd';
import styles from '@/app/list.module.css';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await publicService.getNewsDetail(id);
    return {
      title: item.title,
      description: item.summary || undefined,
    };
  } catch {
    return { title: '新闻详情' };
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let item;
  try {
    item = await publicService.getNewsDetail(id);
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
          <Link href="/news" className={styles.detailBreadcrumbLink}>
            <span>新闻中心</span>
          </Link>
          <span className={styles.detailBreadcrumbSeparator}>/</span>
          <span className={styles.detailBreadcrumbCurrent}>{item.title}</span>
        </div>
      </div>

      <section className={`site-shell page-detail page-content-end-compact ${styles.detailPage}`}>
        <article className={styles.detailArticle}>
          {item.coverImage && (
            <div className={styles.detailCover}>
              <LazyImage
                src={item.coverImage}
                alt={item.title}
                height={450}
                borderRadius={0}
              />
              <div className={styles.detailCoverOverlay} />
            </div>
          )}

          <div className={styles.detailContent}>
            <div className={styles.detailMeta}>
              <span className={`${styles.detailBadge} ${styles.detailBadgeBrand}`}>{item.categoryName || '新闻'}</span>
              <span className={styles.detailSeparator}>·</span>
              <time className={styles.detailDate}>{formatPublicDate(item.publishedAt)}</time>
            </div>

            <h1 className={styles.detailTitle}>{item.title}</h1>

            {item.summary && (
              <p className={styles.detailSummary}>{item.summary}</p>
            )}

            <div className={styles.detailDivider} />

            <div className={styles.detailBody}>
              <RichContent
                content={item.content}
                fallback="新闻正文待补充。"
              />
            </div>

            <div className={styles.detailFooter}>
              <div className={styles.detailTags}>
                <span className={styles.detailTagLabel}>分类：</span>
                <span className={`${styles.detailTag} ${styles.detailTagBrand}`}>{item.categoryName || '新闻'}</span>
              </div>
            </div>
          </div>
        </article>

        <NewsArticleJsonLd
          headline={item.title}
          description={item.summary || item.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)}
          datePublished={item.publishedAt || new Date().toISOString()}
          image={item.coverImage || undefined}
        />

        <BreadcrumbListJsonLd items={[
          { position: 1, name: '首页', item: 'http://localhost:3001/' },
          { position: 2, name: '新闻中心', item: 'http://localhost:3001/news' },
          { position: 3, name: item.title, item: `http://localhost:3001/news/${item.id}` },
        ]} />
      </section>
    </>
  );
}
