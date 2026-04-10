import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { publicService } from '@/services/public-service';

export const metadata: Metadata = buildMetadata({
  title: '产品中心',
  description: '查看企业产品目录、分类信息与详细参数说明。',
  path: '/products',
});

export default async function ProductListPage() {
  const products = await publicService.getProducts();

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">产品中心</h1>
        <div style={{ display: 'grid', gap: 18, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {products.list.length === 0 ? <div className="section-copy">暂无已发布产品。</div> : null}
          {products.list.map((item) => (
            <Link key={item.id} href={`/products/${item.id}`} className="site-card" style={{ padding: 22 }}>
              <div style={{ color: 'var(--accent)', marginBottom: 10 }}>{item.categoryName || '产品'}</div>
              <h2 style={{ margin: '0 0 10px', fontSize: 24 }}>{item.name}</h2>
              <p className="section-copy" style={{ margin: 0 }}>{item.summary || '产品摘要待补充。'}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
