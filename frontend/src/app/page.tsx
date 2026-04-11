import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroBanner } from '@/components/HeroBanner';
import { SectionHeading } from '@/components/SectionHeading';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';

export async function generateMetadata(): Promise<Metadata> {
  const home = await publicService.getHome();

  return buildMetadata({
    title: home.page.seoTitle || home.page.title || '首页',
    description: pickDescription(home.page.seoDescription, home.page.content),
    path: '/',
  });
}

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

      <section className="animate-fade-in-up delay-100" style={{ 
        padding: '40px 0',
        background: 'var(--surface)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ padding: '20px 0' }}>
            <SectionHeading eyebrow="About" title={home.page.title || 'A focused company presence built for clarity.'} description={home.page.content || 'Use the admin site content module to enrich the homepage introduction, advantages, and structured content.'} />
          </div>
        </div>
      </section>

      <section className="site-shell animate-fade-in-up delay-200" style={{ padding: '16px 0 40px' }}>
        <div style={{ display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {products.list.slice(0, 3).map((item) => (
            <article key={item.id} className="site-card" style={{ padding: 32 }}>
              <div style={{ color: 'var(--accent)', marginBottom: 14, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.categoryName || '产品'}</div>
              <h3 style={{ margin: '0 0 14px', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>{item.name}</h3>
              <p className="section-copy" style={{ margin: 0, fontSize: 15 }}>{item.summary || '产品摘要可在后台继续补充。'}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="animate-fade-in-up delay-200" style={{ 
        padding: '48px 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="site-card" style={{ padding: 40, marginBottom: 32 }}>
            <SectionHeading eyebrow="News" title="Latest News" description="Keep visitors informed with the latest company updates and industry developments." />
            <div className="news-list" style={{ display: 'grid', gap: 0 }}>
              {news.list.slice(0, 4).map((item, index) => (
                <Link 
                  key={item.id} 
                  href={`/news/${item.id}`} 
                  className="news-link"
                  style={{
                    padding: '24px 0',
                    borderBottom: index < 3 ? '1px solid var(--line)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 19, marginBottom: 8, fontWeight: 600 }}>{item.title}</div>
                      <div className="section-copy" style={{ fontSize: 15 }}>{item.summary || '新闻摘要待补充。'}</div>
                    </div>
                    <span style={{ fontSize: 20, opacity: 0.3, flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="site-card" style={{ padding: 40 }}>
            <SectionHeading eyebrow="Announcements" title="Official Notices" description="Highlight top notices and operational announcements for customers and partners." />
            <div className="announcement-list" style={{ display: 'grid', gap: 0 }}>
              {announcements.list.slice(0, 4).map((item, index) => (
                <Link 
                  key={item.id} 
                  href={`/announcements/${item.id}`} 
                  className="announcement-link"
                  style={{
                    padding: '24px 0',
                    borderBottom: index < 3 ? '1px solid var(--line)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 19, marginBottom: 8, fontWeight: 600 }}>{item.title}</div>
                      <div className="section-copy" style={{ fontSize: 15 }}>{item.summary || '公告摘要待补充。'}</div>
                    </div>
                    <span style={{ fontSize: 20, opacity: 0.3, flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .news-link, .announcement-link {
          display: block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .news-link:hover, .announcement-link:hover {
          background: var(--brand-soft);
          margin: 0 -40px;
          padding-left: 40px;
          padding-right: 40px;
          border-radius: 8px;
        }
      `}} />
    </>
  );
}
