import { publicService } from '@/services/public-service';

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await publicService.getNewsDetail(id);

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <article className="site-card" style={{ padding: 36 }}>
        <div style={{ color: 'var(--brand)', marginBottom: 10 }}>{item.categoryName || '新闻'}</div>
        <h1 className="section-title">{item.title}</h1>
        <p className="section-copy" style={{ marginTop: 18 }}>{item.summary || '新闻摘要待补充。'}</p>
      </article>
    </section>
  );
}
