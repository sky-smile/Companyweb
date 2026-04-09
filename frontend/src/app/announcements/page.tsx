import { publicService } from '@/services/public-service';

export default async function AnnouncementListPage() {
  const items = await publicService.getAnnouncements();

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">公告</h1>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {items.list.map((item) => (
            <a key={item.id} href={`/announcements/${item.id}`} style={{ paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.title}</div>
              <div className="section-copy">{item.summary || '公告摘要待补充。'}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
