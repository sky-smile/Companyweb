'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { publicService } from '@/services/public-service';
import type { ProductItem } from '@/types/public';
import { Pagination } from '@/components/Pagination';
import { GridSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import styles from '../list.module.css';

const PAGE_SIZE = 9;

export function ProductListClient() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await publicService.getProducts({ page: currentPage, pageSize: PAGE_SIZE });
        setProducts(data.list || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
            <span className={styles.heroBadgeText}>Products</span>
          </div>
          <h1 className={styles.heroTitle}>产品中心</h1>
          <p className={styles.heroDesc}>
            涵盖核心产品线与专业解决方案，满足多样化工业需求，持续提升产品稳定性与交付效率。
          </p>
        </div>
      </section>

      {/* 产品列表 */}
      <section className={`site-shell ${styles.listSection}`}>
        {loading ? (
          <GridSkeleton count={6} />
        ) : products.length === 0 ? (
          <EmptyState
            title="暂无产品"
            description="当前还没有发布的产品，请稍后再查看。"
            actionHref="/"
            actionLabel="返回首页"
          />
        ) : (
          <>
            <div className={styles.listGrid}>
              {products.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className={styles.card}>
                  <div className={styles.cardAccent} />
                  <div className={styles.cardContent}>
                    <div className={styles.cardCategory}>{item.categoryName || '产品'}</div>
                    <h2 className={styles.cardTitle}>{item.name}</h2>
                    <p className={styles.cardSummary}>
                      {item.summary || '产品摘要待补充。'}
                    </p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardCta}>
                      查看详情
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
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
