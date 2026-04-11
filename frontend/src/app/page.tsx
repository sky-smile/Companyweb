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

      {/* 关于我们 */}
      <section className="about-section animate-fade-in-up delay-100" style={{ 
        padding: '80px 0',
        background: 'var(--surface)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <SectionHeading 
            eyebrow="About Us" 
            title={home.page.title || '专注品质，驱动未来'} 
            description={home.page.content || '我们致力于以创新技术和卓越品质，为客户创造可持续的价值，成为行业值得信赖的合作伙伴。'} 
          />

          {/* 使命 · 愿景 · 价值观 */}
          <div className="about-pillars" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginTop: 40,
          }}>
            <div className="about-pillar" style={{
              padding: '36px 32px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
              border: '1px solid rgba(37, 99, 235, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--brand-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>使命</h3>
              <p className="section-copy" style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(15, 23, 42, 0.72)' }}>
                以技术创新和品质坚守，为客户创造超越期望的价值，推动行业可持续发展。
              </p>
            </div>

            <div className="about-pillar" style={{
              padding: '36px 32px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              border: '1px solid rgba(22, 163, 74, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>愿景</h3>
              <p className="section-copy" style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(15, 23, 42, 0.72)' }}>
                成为全球客户首选的合作伙伴，以专业与诚信构筑值得信赖的品牌形象。
              </p>
            </div>

            <div className="about-pillar" style={{
              padding: '36px 32px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #fef3f2 0%, #ffffff 100%)',
              border: '1px solid rgba(220, 38, 38, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#fef3f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>价值观</h3>
              <p className="section-copy" style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(15, 23, 42, 0.72)' }}>
                品质为先、客户至上、持续创新、合作共赢——每一项决策都以此为准则。
              </p>
            </div>
          </div>

          {/* 企业优势数据 */}
          <div className="about-stats" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 32,
            marginTop: 56,
            padding: '40px 0',
            borderTop: '1px solid var(--line)',
          }}>
            {[
              { value: '15+', label: '年行业经验' },
              { value: '200+', label: '服务客户' },
              { value: '50+', label: '专业技术团队' },
              { value: '99%', label: '客户满意度' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--brand)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ marginTop: 8, fontSize: 14, color: 'rgba(15, 23, 42, 0.6)', fontWeight: 500, letterSpacing: '0.02em' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 了解更多 */}
          <div style={{ marginTop: 8 }}>
            <Link href="/about" className="about-cta-link" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--brand)',
              textDecoration: 'none',
              transition: 'gap 0.3s ease',
            }}>
              了解更多关于我们
              <span style={{ transition: 'transform 0.3s ease' }}>→</span>
            </Link>
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

      <section className="animate-fade-in-up delay-300" style={{
        padding: '48px 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderTop: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* 新闻区域 */}
          <div style={{ marginBottom: 56 }}>
            <SectionHeading eyebrow="News" title="Latest News" description="Keep visitors informed with the latest company updates and industry developments." />
            <div className="news-list" style={{ display: 'grid', gap: 0 }}>
              {news.list.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="news-link"
                  style={{
                    padding: '28px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, marginBottom: 10, fontWeight: 600, letterSpacing: '-0.01em' }}>{item.title}</div>
                    <div className="section-copy" style={{ fontSize: 15, lineHeight: 1.7 }}>{item.summary || '新闻摘要待补充。'}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 公告区域 */}
          <div>
            <SectionHeading eyebrow="Announcements" title="Official Notices" description="Highlight top notices and operational announcements for customers and partners." />
            <div className="announcement-list" style={{ display: 'grid', gap: 0 }}>
              {announcements.list.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/announcements/${item.id}`}
                  className="announcement-link"
                  style={{
                    padding: '28px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, marginBottom: 10, fontWeight: 600, letterSpacing: '-0.01em' }}>{item.title}</div>
                    <div className="section-copy" style={{ fontSize: 15, lineHeight: 1.7 }}>{item.summary || '公告摘要待补充。'}</div>
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
          border-radius: 8px;
          margin: 0 -12px;
          padding-left: 12px;
          padding-right: 12px;
        }

        .news-link:hover, .announcement-link:hover {
          background: var(--brand-soft);
        }

        .about-pillar:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
        }

        .about-cta-link:hover {
          gap: 14px;
        }

        .about-cta-link:hover span {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .about-section {
            padding: 56px 0;
          }

          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 480px) {
          .about-section {
            padding: 40px 0;
          }

          .about-pillars {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </>
  );
}
