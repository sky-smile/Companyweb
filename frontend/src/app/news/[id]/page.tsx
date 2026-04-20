'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { LazyImage } from '@/components/LazyImage';
import { RichContent } from '@/components/RichContent';
import { NewsArticleJsonLd, BreadcrumbListJsonLd } from '@/components/JsonLd';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import styles from '@/app/list.module.css';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await publicService.getNewsDetail(id);
        setItem(data);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError('新闻不存在或尚未发布。');
          } else if (err.status === 0) {
            setError(err.message || '无法连接到服务器，请检查网络或后端服务。');
          } else {
            setError(err.message || '加载失败，请稍后重试。');
          }
        } else {
          setError('加载失败，请稍后重试。');
        }
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
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
          description="当前新闻可能已下线或尚未发布。"
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
          <Link href="/news" className={styles.detailBreadcrumbLink}>
            <span>新闻中心</span>
          </Link>
          <span className={styles.detailBreadcrumbSeparator}>/</span>
          <span className={styles.detailBreadcrumbCurrent}>{item.title}</span>
        </div>
      </div>

      <section className={`site-shell page-detail page-content-end-compact ${styles.detailPage}`}>
        <article className={styles.detailArticle}>
          {/* 封面图片 */}
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

          {/* 内容区域 */}
          <div className={styles.detailContent}>
            {/* 分类和日期 */}
            <div className={styles.detailMeta}>
              <span className={`${styles.detailBadge} ${styles.detailBadgeBrand}`}>{item.categoryName || '新闻'}</span>
              <span className={styles.detailSeparator}>·</span>
              <time className={styles.detailDate}>{formatPublicDate(item.publishedAt)}</time>
            </div>

            {/* 标题 */}
            <h1 className={styles.detailTitle}>{item.title}</h1>

            {/* 摘要 */}
            {item.summary && (
              <p className={styles.detailSummary}>{item.summary}</p>
            )}

            {/* 分隔线 */}
            <div className={styles.detailDivider} />

            {/* 富文本内容 */}
            <div className={styles.detailBody}>
              <RichContent
                content={item.content}
                fallback="新闻正文待补充。"
              />
            </div>

            {/* 底部标签区域 */}
            <div className={styles.detailFooter}>
              <div className={styles.detailTags}>
                <span className={styles.detailTagLabel}>分类：</span>
                <span className={`${styles.detailTag} ${styles.detailTagBrand}`}>{item.categoryName || '新闻'}</span>
              </div>
            </div>
          </div>
        </article>

        {/* JSON-LD 结构化数据 */}
        <NewsArticleJsonLd
          headline={item.title}
          description={item.summary || item.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)}
          datePublished={item.publishedAt || new Date().toISOString()}
          image={item.coverImage || undefined}
        />

        {/* 面包屑 JSON-LD */}
        <BreadcrumbListJsonLd items={[
          { position: 1, name: '首页', item: 'http://localhost:3001/' },
          { position: 2, name: '新闻中心', item: 'http://localhost:3001/news' },
          { position: 3, name: item.title, item: `http://localhost:3001/news/${item.id}` },
        ]} />
      </section>
    </>
  );
}
