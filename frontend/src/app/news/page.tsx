import { publicService } from '@/services/public-service';

export default async function NewsListPage() {
  const news = await publicService.getNewsList();

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">新闻中心</h1>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {news.list.map((item) => (
            <a key={item.id} href={`/news/${item.id}`} style={{ paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.title}</div>
              <div className="section-copy">{item.summary || '新闻摘要待补充。'}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
