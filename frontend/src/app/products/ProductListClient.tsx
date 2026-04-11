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
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">产品中心</h1>
        
        {loading ? (
          <div style={{ marginTop: 24 }}>
            <GridSkeleton count={6} />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="暂无产品"
            description="当前还没有发布的产品，请稍后再查看。"
            actionHref="/"
            actionLabel="返回首页"
          />
        ) : (
          <>
            <div style={{ display: 'grid', gap: 18, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {paginatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="site-card" style={{ padding: 24, display: 'block', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 24px 64px rgba(46, 28, 17, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div style={{ color: 'var(--accent)', marginBottom: 10, fontSize: 13, fontWeight: 500 }}>{item.categoryName || '产品'}</div>
                  <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 600 }}>{item.name}</h2>
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
      </div>
    </section>
  );
}
