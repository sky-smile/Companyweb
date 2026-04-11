import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate, parseProductParameters, parseStringArray } from '@/lib/public-content';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LazyImage } from '@/components/LazyImage';
import { RichContent } from '@/components/RichContent';
import { ProductJsonLd } from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const item = await publicService.getProductDetail(id);

    return buildMetadata({
      title: item.name,
      description: pickDescription(item.summary, item.content),
      path: `/products/${id}`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return buildMetadata({
        title: '产品不存在',
        description: '当前产品不存在或尚未发布。',
        path: `/products/${id}`,
      });
    }

    throw error;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const item = await publicService.getProductDetail(id);
    const images = parseStringArray(item.imagesJson);
    const parameters = parseProductParameters(item.parametersJson);

    // 获取相关产品（用于推荐）
    const allProducts = await publicService.getProducts();
    const relatedProducts = allProducts.list
      .filter((p) => p.id !== item.id && p.categoryId === item.categoryId)
      .slice(0, 3);

    return (
      <section className="site-shell" style={{ padding: '42px 0' }}>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: '首页', href: '/' },
            { label: '产品中心', href: '/products' },
            { label: item.name },
          ]}
        />

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
              {images.map((imageUrl, index) => (
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
            <h2 style={{ margin: '0 0 20px', fontSize: 26, fontWeight: 600 }}>相关产品</h2>
            <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="site-card"
                  style={{ padding: 24, display: 'block', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 24px 64px rgba(46, 28, 17, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
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
          description={item.summary || item.content}
          image={images[0] || undefined}
        />
      </section>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
