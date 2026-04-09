import { publicService } from '@/services/public-service';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await publicService.getProductDetail(id);

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <article className="site-card" style={{ padding: 36, display: 'grid', gap: 18 }}>
        <div style={{ color: 'var(--accent)' }}>{item.categoryName || '产品'}</div>
        <h1 className="section-title">{item.name}</h1>
        <p className="section-copy" style={{ margin: 0 }}>{item.summary || '产品摘要待补充。'}</p>
        <div className="section-copy">参数：{item.parametersJson || '暂无参数'}</div>
      </article>
    </section>
  );
}
