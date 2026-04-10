import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate, parseProductParameters, parseStringArray } from '@/lib/public-content';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';

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

    return (
      <section className="site-shell" style={{ padding: '42px 0' }}>
        <article className="site-card" style={{ padding: 36, display: 'grid', gap: 18 }}>
          <div style={{ color: 'var(--accent)' }}>
            {item.categoryName || '产品'} · {formatPublicDate(item.publishedAt)}
          </div>
          <h1 className="section-title">{item.name}</h1>
          <p className="section-copy" style={{ margin: 0 }}>{item.summary || '产品摘要待补充。'}</p>
          {images.length > 0 ? (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {images.map((imageUrl) => (
                <div key={imageUrl} className="site-card" style={{ overflow: 'hidden', borderRadius: 20 }}>
                  <img src={imageUrl} alt={item.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ) : null}
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>
            {item.content || '产品正文待补充。'}
          </div>
          <section>
            <h2 style={{ margin: '0 0 16px', fontSize: 24 }}>产品参数</h2>
            {parameters.length === 0 ? <div className="section-copy">暂无参数。</div> : null}
            {parameters.length > 0 ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {parameters.map((parameter) => (
                  <div key={`${parameter.label}-${parameter.value}`} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
                    <strong>{parameter.label}</strong>
                    <span className="section-copy">{parameter.value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </article>
      </section>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
