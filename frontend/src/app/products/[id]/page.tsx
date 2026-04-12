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
    <section className="site-shell page-detail page-content-end-compact" style={{ paddingTop: 'var(--page-top-detail, 100px)' }}>
      <article className="site-card" style={{ padding: 36, display: 'grid', gap: 24 }}>
        {/* 分类和日期 */}
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--accent)', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500 }}>{item.categoryName || '产品'}</span>
          <span>·</span>
          <span>{formatPublicDate(item.publishedAt)}</span>
        </div>

        {/* 标题 */}
        <h1 className="section-title" style={{ margin: 0 }}>{item.name}</h1>

        {/* 摘要 */}
        {item.summary && (
          <p className="section-copy" style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
            {item.summary}
          </p>
        )}

        {/* 产品图片 */}
        {images.length > 0 && (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {images.map((imageUrl: string, index: number) => (
              <LazyImage
                key={imageUrl}
                src={imageUrl}
                alt={`${item.name} - 图片 ${index + 1}`}
                height={280}
              />
            ))}
          </div>
        )}

        {/* 产品内容 */}
        <RichContent
          content={item.content}
          fallback="产品正文待补充。"
        />

        {/* 产品参数 */}
        {parameters.length > 0 && (
          <section style={{ marginTop: 8 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 600 }}>产品参数</h2>
            <div style={{ display: 'grid', gap: 0 }}>
              {parameters.map((parameter, index) => (
                <div
                  key={`${parameter.label}-${index}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                    gap: 16,
                    padding: '14px 0',
                    borderBottom: index < parameters.length - 1 ? '1px solid var(--line)' : 'none',
                  }}
                >
                  <strong style={{ color: 'rgba(29, 20, 15, 0.7)' }}>{parameter.label}</strong>
                  <span className="section-copy">{parameter.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* 相关产品推荐 */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>相关产品</h2>
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                style={{
                  padding: 24,
                  display: 'block',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--line)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: 10, fontSize: 13, fontWeight: 500 }}>
                  {product.categoryName || '产品'}
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 600 }}>{product.name}</h3>
                <p className="section-copy" style={{ margin: 0, fontSize: 14 }}>
                  {product.summary || '产品摘要待补充。'}
                </p>
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
    </section>
  );
}
