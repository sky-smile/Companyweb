'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '@/lib/api';
import { formatPublicDate, parseProductParameters, parseStringArray } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { LazyImage } from '@/components/LazyImage';
import { RichContent } from '@/components/RichContent';
import { ProductJsonLd } from '@/components/JsonLd';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await publicService.getProductDetail(id);
        setItem(data);

        // 获取相关产品
        const allProducts = await publicService.getProducts();
        const related = allProducts.list
          .filter((p: any) => p.id !== data.id && p.categoryId === data.categoryId)
          .slice(0, 3);
        setRelatedProducts(related);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('产品不存在或尚未发布。');
        } else {
          setError('加载失败，请稍后重试。');
        }
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <section className="site-shell page-detail page-content-end-compact" style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
        <div className="site-card" style={{ padding: 36 }}>
          <ListSkeleton count={1} />
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="site-shell page-detail page-content-end-compact" style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
        <EmptyState
          title={error || '加载失败'}
          description="当前产品可能已下线或尚未发布。"
          actionHref="/products"
          actionLabel="查看产品列表"
        />
      </section>
    );
  }

  const images = parseStringArray(item.imagesJson);
  const parameters = parseProductParameters(item.parametersJson);

  return (
    <section className="site-shell page-detail page-content-end-compact product-detail-page" style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
      <article className="product-detail-article">
        {/* 面包屑导航 */}
        <Breadcrumb items={[
          { label: '首页', href: '/' },
          { label: '产品中心', href: '/products' },
          { label: item.categoryName || '产品详情' },
          { label: item.name },
        ]} />

        {/* 产品图片 */}
        {images.length > 0 && (
          <div className="product-images-section">
            <div className="product-images-grid">
              {images.map((imageUrl: string, index: number) => (
                <LazyImage
                  key={imageUrl}
                  src={imageUrl}
                  alt={`${item.name} - 图片 ${index + 1}`}
                  height={320}
                  style={{ 
                    borderRadius: index === 0 ? '16px 0 0 0' : index === images.length - 1 ? '0 0 16px 0' : '0'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <div className="product-content-wrapper">
          {/* 分类和日期 */}
          <div className="product-meta">
            <span className="product-category-badge">{item.categoryName || '产品'}</span>
            <span className="product-separator">·</span>
            <time className="product-date">{formatPublicDate(item.publishedAt)}</time>
          </div>

          {/* 标题 */}
          <h1 className="product-detail-name">{item.name}</h1>

          {/* 摘要 */}
          {item.summary && (
            <p className="product-detail-summary">{item.summary}</p>
          )}

          {/* 分隔线 */}
          <div className="product-divider" />

          {/* 产品内容 */}
          <RichContent
            content={item.content}
            fallback="产品正文待补充。"
          />

          {/* 产品参数 */}
          {parameters.length > 0 && (
            <section className="product-parameters">
              <h2 className="product-params-title">产品参数</h2>
              <div className="product-params-grid">
                {parameters.map((parameter, index) => (
                  <div
                    key={`${parameter.label}-${index}`}
                    className={`product-param-item ${index % 2 === 0 ? 'product-param-even' : 'product-param-odd'}`}
                  >
                    <dt className="product-param-label">{parameter.label}</dt>
                    <dd className="product-param-value">{parameter.value}</dd>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* 相关产品推荐 */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2 className="related-products-title">相关产品</h2>
          <div className="related-products-grid">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="related-product-card"
              >
                <div className="related-product-category">
                  {product.categoryName || '产品'}
                </div>
                <h3 className="related-product-name">{product.name}</h3>
                <p className="related-product-summary">
                  {product.summary || '产品摘要待补充。'}
                </p>
                <div className="related-product-cta">
                  <span>查看详情</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD 结构化数据 */}
      <ProductJsonLd
        name={item.name}
        description={item.summary || item.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)}
        image={images[0] || undefined}
      />

      {/* 样式 */}
      <style jsx>{`
        /* ========== 页面容器 ========== */
        .product-detail-page {
          padding-top: var(--page-top-detail, 100px);
          padding-bottom: 80px;
        }

        /* ========== 文章卡片 ========== */
        .product-detail-article {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* ========== 产品图片区域 ========== */
        .product-images-section {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border-bottom: 1px solid var(--line);
        }

        .product-images-grid {
          display: grid;
          gap: 2px;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .product-images-grid :global(.lazy-image-shimmer) {
          border-radius: 0;
          display: block;
        }

        /* ========== 内容区域 ========== */
        .product-content-wrapper {
          padding: 48px 56px;
        }

        /* ========== 元信息 ========== */
        .product-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .product-category-badge {
          color: var(--accent);
          font-weight: 600;
          padding: 6px 14px;
          background: var(--accent-soft);
          border-radius: 20px;
          font-size: 13px;
          letter-spacing: 0.02em;
        }

        .product-separator {
          color: var(--text-muted);
          font-size: 12px;
        }

        .product-date {
          color: var(--text-muted);
          font-size: 14px;
        }

        /* ========== 标题 ========== */
        .product-detail-name {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--foreground);
          margin: 0 0 20px;
          letter-spacing: -0.02em;
        }

        /* ========== 摘要 ========== */
        .product-detail-summary {
          font-size: 17px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin: 0 0 32px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
          border-left: 4px solid var(--accent);
          border-radius: 0 12px 12px 0;
        }

        /* ========== 分隔线 ========== */
        .product-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--line), transparent);
          margin: 32px 0;
        }

        /* ========== 产品参数 ========== */
        .product-parameters {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid var(--line);
        }

        .product-params-title {
          margin: 0 0 24px;
          font-size: 24px;
          font-weight: 700;
          color: var(--foreground);
          letter-spacing: -0.01em;
        }

        .product-params-grid {
          display: grid;
          gap: 0;
          border: 1px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
        }

        .product-param-item {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 20px;
          padding: 18px 24px;
          border-bottom: 1px solid var(--line);
          transition: background 0.2s ease;
        }

        .product-param-item:last-child {
          border-bottom: none;
        }

        .product-param-even {
          background: #ffffff;
        }

        .product-param-odd {
          background: #fafbfc;
        }

        .product-param-item:hover {
          background: var(--brand-soft);
        }

        .product-param-label {
          margin: 0;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 15px;
        }

        .product-param-value {
          margin: 0;
          color: var(--foreground);
          font-size: 15px;
          line-height: 1.6;
        }

        /* ========== 相关产品 ========== */
        .related-products-section {
          margin-top: 48px;
        }

        .related-products-title {
          margin: 0 0 28px;
          font-size: 26px;
          font-weight: 700;
          color: var(--foreground);
          letter-spacing: -0.01em;
        }

        .related-products-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .related-product-card {
          display: block;
          padding: 28px;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: #ffffff;
          text-decoration: none;
          color: inherit;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .related-product-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent);
          transform: scaleY(0);
          transition: transform 0.3s ease;
          border-radius: 2px;
        }

        .related-product-card:hover {
          border-color: rgba(14, 165, 233, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .related-product-card:hover::before {
          transform: scaleY(1);
        }

        .related-product-category {
          color: var(--accent);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
          letter-spacing: 0.03em;
        }

        .related-product-name {
          margin: 0 0 12px;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.35;
          color: var(--foreground);
          transition: color 0.2s ease;
        }

        .related-product-card:hover .related-product-name {
          color: var(--accent);
        }

        .related-product-summary {
          margin: 0 0 16px;
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-product-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s ease;
        }

        .related-product-card:hover .related-product-cta {
          opacity: 1;
          transform: translateX(0);
        }

        .related-product-cta svg {
          transition: transform 0.3s ease;
        }

        .related-product-card:hover .related-product-cta svg {
          transform: translateX(4px);
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 1024px) {
          .product-content-wrapper {
            padding: 40px 40px;
          }

          .product-detail-name {
            font-size: 28px;
          }

          .product-params-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .product-detail-page {
            padding-top: var(--page-top-detail, 88px);
            padding-bottom: 60px;
          }

          .product-detail-article {
            border-radius: 0;
            box-shadow: none;
          }

          .product-images-grid {
            grid-template-columns: 1fr;
          }

          .product-content-wrapper {
            padding: 32px 24px;
          }

          .product-meta {
            margin-bottom: 16px;
          }

          .product-detail-name {
            font-size: 24px;
            margin-bottom: 16px;
          }

          .product-detail-summary {
            font-size: 15px;
            padding: 16px 20px;
            margin-bottom: 24px;
          }

          .product-divider {
            margin: 24px 0;
          }

          .product-params-title {
            font-size: 20px;
            margin-bottom: 20px;
          }

          .product-param-item {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 14px 18px;
          }

          .product-param-label {
            font-size: 14px;
          }

          .product-param-value {
            font-size: 14px;
          }

          .related-products-section {
            margin-top: 36px;
          }

          .related-products-title {
            font-size: 22px;
            margin-bottom: 20px;
          }

          .related-products-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .related-product-card {
            padding: 20px;
          }

          .related-product-cta {
            opacity: 1;
            transform: translateX(0);
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .product-content-wrapper {
            padding: 24px 16px;
          }

          .product-detail-name {
            font-size: 22px;
            line-height: 1.35;
          }

          .product-meta {
            font-size: 13px;
          }

          .product-detail-summary {
            font-size: 14px;
            padding: 14px 16px;
          }

          .product-params-title {
            font-size: 18px;
          }

          .related-product-name {
            font-size: 17px;
            margin-bottom: 10px;
          }

          .related-product-summary {
            font-size: 13px;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </section>
  );
}
