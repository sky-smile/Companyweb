import Link from 'next/link';
import { HeroBanner } from '@/components/HeroBanner';
import { SectionHeading } from '@/components/SectionHeading';
import { publicService } from '@/services/public-service';

export default async function HomePage() {
  const [home, news, announcements, products] = await Promise.all([
    publicService.getHome(),
    publicService.getNewsList(),
    publicService.getAnnouncements(),
    publicService.getProducts(),
  ]);

  return (
    <>
      <HeroBanner banners={home.banners} />

      <section className="site-shell" style={{ padding: '16px 0 24px' }}>
        <div className="site-card" style={{ padding: 32 }}>
          <SectionHeading eyebrow="About" title={home.page.title || 'A focused company presence built for clarity.'} description={home.page.content || 'Use the admin site content module to enrich the homepage introduction, advantages, and structured content.'} />
        </div>
      </section>

      <section className="site-shell" style={{ padding: '8px 0 24px' }}>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {products.list.slice(0, 3).map((item) => (
            <article key={item.id} className="site-card" style={{ padding: 24 }}>
              <div style={{ color: 'var(--accent)', marginBottom: 10 }}>{item.categoryName || '产品'}</div>
              <h3 style={{ margin: '0 0 10px', fontSize: 24 }}>{item.name}</h3>
              <p className="section-copy" style={{ margin: 0 }}>{item.summary || '产品摘要可在后台继续补充。'}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-shell" style={{ padding: '8px 0 24px' }}>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div className="site-card" style={{ padding: 28 }}>
            <SectionHeading eyebrow="News" title="Latest News" description="Keep visitors informed with the latest company updates and industry developments." />
            <div style={{ display: 'grid', gap: 14 }}>
              {news.list.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} style={{ paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{item.title}</div>
                <div className="section-copy">{item.summary || '新闻摘要待补充。'}</div>
              </Link>
              ))}
            </div>
          </div>
          <div className="site-card" style={{ padding: 28 }}>
            <SectionHeading eyebrow="Announcements" title="Official Notices" description="Highlight top notices and operational announcements for customers and partners." />
            <div style={{ display: 'grid', gap: 14 }}>
              {announcements.list.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/announcements/${item.id}`} style={{ paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{item.title}</div>
                <div className="section-copy">{item.summary || '公告摘要待补充。'}</div>
              </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
