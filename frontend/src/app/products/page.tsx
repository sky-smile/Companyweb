import { publicService } from '@/services/public-service';

export default async function ProductListPage() {
  const products = await publicService.getProducts();

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">产品中心</h1>
        <div style={{ display: 'grid', gap: 18, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {products.list.map((item) => (
            <a key={item.id} href={`/products/${item.id}`} className="site-card" style={{ padding: 22 }}>
              <div style={{ color: 'var(--accent)', marginBottom: 10 }}>{item.categoryName || '产品'}</div>
              <h2 style={{ margin: '0 0 10px', fontSize: 24 }}>{item.name}</h2>
              <p className="section-copy" style={{ margin: 0 }}>{item.summary || '产品摘要待补充。'}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
