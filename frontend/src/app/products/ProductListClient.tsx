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
      <section className="page-hero products-hero">
        {/* 背景装饰 */}
        <div className="hero-background-decoration" />
        <div className="hero-secondary-decoration" />
        
        <div className="site-shell hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">Products</div>
            <h1 className="hero-title">产品中心</h1>
            <p className="hero-description">
              涵盖核心产品线与专业解决方案，满足多样化工业需求，持续提升产品稳定性与交付效率。
            </p>
          </div>
        </div>
      </section>

      {/* 产品列表 */}
      <section className="site-shell products-list-section">
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
            <div className="products-grid">
              {paginatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="product-card">
                  {/* 卡片顶部装饰条 */}
                  <div className="product-card-accent" />
                  
                  {/* 产品图标/图片占位 */}
                  <div className="product-card-image">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect x="8" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M16 12V8a2 2 0 012-2h12a2 2 0 012 2v4" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.2"/>
                    </svg>
                  </div>
                  
                  {/* 产品信息 */}
                  <div className="product-card-content">
                    <div className="product-category">{item.categoryName || '产品'}</div>
                    <h2 className="product-name">{item.name}</h2>
                    <p className="product-summary">
                      {item.summary || '产品摘要待补充。'}
                    </p>
                  </div>
                  
                  {/* 底部装饰 */}
                  <div className="product-card-footer">
                    <span className="product-cta">
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
              total={total || products.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      {/* 样式 */}
      <style jsx>{`
        /* ========== 页面头部 Hero ========== */
        .products-hero {
          position: relative;
          padding-top: var(--page-top, 108px);
          padding-bottom: 56px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 50%, #ffffff 100%);
          border-bottom: 1px solid var(--line);
        }

        .hero-background-decoration {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .hero-secondary-decoration {
          position: absolute;
          bottom: -15%;
          left: -5%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-text {
          max-width: 700px;
        }

        .hero-eyebrow {
          color: var(--brand);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.25rem, 5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }

        .hero-description {
          margin-top: 18px;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 600px;
        }

        /* ========== 产品列表区域 ========== */
        .products-list-section {
          padding-top: 72px;
          padding-bottom: 72px;
        }

        .products-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        /* ========== 产品卡片 ========== */
        .product-card {
          display: block;
          position: relative;
          padding: 0;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: #ffffff;
          text-decoration: none;
          color: inherit;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .product-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        /* 顶部装饰条 */
        .product-card-accent {
          height: 4px;
          background: linear-gradient(90deg, var(--brand), var(--accent));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-card-accent {
          opacity: 1;
        }

        /* 图片区域 */
        .product-card-image {
          padding: 32px 28px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          color: var(--brand);
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-card-image {
          opacity: 1;
        }

        .product-card-image svg {
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-card-image svg {
          transform: scale(1.1);
        }

        /* 内容区域 */
        .product-card-content {
          padding: 0 28px 20px;
        }

        .product-category {
          color: var(--accent);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .product-name {
          margin: 0 0 14px;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.35;
          color: var(--foreground);
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }

        .product-card:hover .product-name {
          color: var(--brand);
        }

        .product-summary {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* 底部 CTA */
        .product-card-footer {
          padding: 0 28px 24px;
        }

        .product-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--brand);
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.3s ease;
        }

        .product-card:hover .product-cta {
          opacity: 1;
          transform: translateY(0);
        }

        .product-cta svg {
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-cta svg {
          transform: translateX(4px);
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .products-hero {
            padding-top: var(--page-top, 96px);
            padding-bottom: 48px;
          }

          .hero-background-decoration {
            width: 350px;
            height: 350px;
            top: -15%;
            right: -15%;
          }

          .hero-secondary-decoration {
            width: 300px;
            height: 300px;
            bottom: -10%;
            left: -10%;
          }

          .hero-title {
            font-size: clamp(1.75rem, 6vw, 2.25rem);
          }

          .hero-description {
            font-size: 15px;
            margin-top: 14px;
          }

          .products-list-section {
            padding-top: 48px;
            padding-bottom: 48px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 18px;
          }

          .product-card-image {
            padding: 24px 20px 18px;
          }

          .product-card-content {
            padding: 0 20px 16px;
          }

          .product-card-footer {
            padding: 0 20px 20px;
          }

          .product-name {
            font-size: 18px;
            margin-bottom: 12px;
          }

          .product-summary {
            font-size: 14px;
            -webkit-line-clamp: 2;
          }

          .product-cta {
            opacity: 1;
            transform: translateY(0);
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .hero-eyebrow {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .hero-description {
            font-size: 14px;
            line-height: 1.6;
          }

          .products-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .product-card-image {
            padding: 20px 16px 16px;
          }

          .product-card-content {
            padding: 0 16px 14px;
          }

          .product-card-footer {
            padding: 0 16px 18px;
          }

          .product-category {
            font-size: 12px;
            margin-bottom: 10px;
          }

          .product-name {
            font-size: 17px;
            line-height: 1.35;
          }
        }
      `}</style>
    </>
  );
}
