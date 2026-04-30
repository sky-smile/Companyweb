import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { formatPublicDate, parseProductParameters, parseStringArray } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { LazyImage } from '@/components/LazyImage';
import { RichContent } from '@/components/RichContent';
import { ProductJsonLd } from '@/components/JsonLd';
import styles from '@/app/list.module.css';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await publicService.getProductDetail(id);
    return buildMetadata({
      title: item.name,
      description: pickDescription(item.summary, item.content),
      path: `/products/${id}`,
    });
  } catch {
    return buildMetadata({ title: '产品详情', path: '/products' });
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let item;
  try {
    item = await publicService.getProductDetail(id);
  } catch {
    notFound();
  }

  const [allProducts] = await Promise.all([
    publicService.getProducts(),
  ]);

  const relatedProducts = allProducts.list
    .filter((p) => p.id !== item.id && p.categoryId === item.categoryId)
    .slice(0, 3);

  const images = parseStringArray(item.imagesJson);
  const parameters = parseProductParameters(item.parametersJson);

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
          <Link href="/products" className={styles.detailBreadcrumbLink}>
            <span>产品中心</span>
          </Link>
          <span className={styles.detailBreadcrumbSeparator}>/</span>
          <span className={styles.detailBreadcrumbText}>{item.categoryName || '产品'}</span>
          <span className={styles.detailBreadcrumbSeparator}>/</span>
          <span className={styles.detailBreadcrumbCurrent}>{item.name}</span>
        </div>
      </div>

      <section className={`site-shell page-detail page-content-end-compact ${styles.detailPage}`}>
        <article className={styles.detailArticle}>
          {images.length > 0 && (
            <div className={styles.productImages}>
              <div className={styles.productImagesGrid}>
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

          <div className={styles.detailContent}>
            <div className={styles.detailMeta}>
              <span className={`${styles.detailBadge} ${styles.detailBadgeAccent}`}>{item.categoryName || '产品'}</span>
              <span className={styles.detailSeparator}>·</span>
              <time className={styles.detailDate}>{formatPublicDate(item.publishedAt)}</time>
            </div>

            <h1 className={styles.detailTitle}>{item.name}</h1>

            {item.summary && (
              <p className={`${styles.detailSummary} ${styles.detailSummaryAccent}`}>{item.summary}</p>
            )}

            <div className={styles.detailDivider} />

            <RichContent
              content={item.content}
              fallback="产品正文待补充。"
            />

            {parameters.length > 0 && (
              <section className={styles.detailParams}>
                <h2 className={styles.detailParamsTitle}>产品参数</h2>
                <div className={styles.detailParamsGrid}>
                  {parameters.map((parameter, index) => (
                    <div
                      key={`${parameter.label}-${index}`}
                      className={`${styles.detailParamItem} ${index % 2 === 0 ? styles.detailParamEven : styles.detailParamOdd}`}
                    >
                      <dt className={styles.detailParamLabel}>{parameter.label}</dt>
                      <dd className={styles.detailParamValue}>{parameter.value}</dd>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>

        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>相关产品</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedCardCategory}>
                    {product.categoryName || '产品'}
                  </div>
                  <h3 className={styles.relatedCardName}>{product.name}</h3>
                  <p className={styles.relatedCardSummary}>
                    {product.summary || '产品摘要待补充。'}
                  </p>
                  <div className={styles.relatedCardCta}>
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

        <ProductJsonLd
          name={item.name}
          description={item.summary || item.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)}
          image={images[0] || undefined}
        />
      </section>
    </>
  );
}
