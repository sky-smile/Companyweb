'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { publicService } from '@/services/public-service';
import { Pagination } from '@/components/Pagination';
import { GridSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';

const PAGE_SIZE = 9;

export function ProductListClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await publicService.getProducts();
        setProducts(data.list || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedProducts = products.slice(
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
              Products
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
            }}>
              产品中心
            </h1>
            <p className="section-copy" style={{ marginTop: 16, maxWidth: 560 }}>
              涵盖核心产品线与专业解决方案，满足多样化工业需求，持续提升产品稳定性与交付效率。
            </p>
          </div>
        </div>
      </section>

      {/* 产品列表 */}
      <section className="site-shell" style={{ padding: '48px 0' }}>
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
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {paginatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} style={{
                  display: 'block',
                  padding: 28,
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--line)',
                  background: '#ffffff',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ color: 'var(--accent)', marginBottom: 12, fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}>{item.categoryName || '产品'}</div>
                  <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>{item.name}</h2>
                  <p className="section-copy" style={{ margin: 0, fontSize: 15 }}>{item.summary || '产品摘要待补充。'}</p>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              total={total || products.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .site-shell a[href^="/products/"]:hover {
          border-color: var(--brand) !important;
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
      `}} />
    </>
  );
}
