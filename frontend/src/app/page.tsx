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

      {/* 产品展示模块 */}
      <section className="products-section animate-fade-in-up delay-200">
        <div className="site-shell">
          {/* 模块标题 */}
          <div className="products-header">
            <div className="products-eyebrow">Our Products</div>
            <h2 className="products-title">核心产品</h2>
            <p className="products-subtitle">
              以创新技术为驱动，打造高品质产品解决方案，助力企业数字化转型
            </p>
          </div>

          {/* 产品卡片网格 */}
          <div className="products-grid">
            {products.list.slice(0, 3).map((item, index) => (
              <Link 
                key={item.id} 
                href={`/products/${item.id}`}
                className="product-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 产品分类标签 */}
                <div className="product-card-category">
                  {item.categoryName || '产品'}
                </div>
                
                {/* 产品名称 */}
                <h3 className="product-card-title">{item.name}</h3>
                
                {/* 产品描述 */}
                <p className="product-card-description">
                  {item.summary || '产品摘要可在后台继续补充。'}
                </p>
                
                {/* 了解更多 */}
                <div className="product-card-action">
                  <span>了解详情</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>

                {/* 悬停装饰 */}
                <div className="product-card-glow" />
              </Link>
            ))}
          </div>

          {/* 查看全部产品 */}
          <div className="products-footer">
            <Link href="/products" className="products-view-all">
              查看全部产品
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-news-section animate-fade-in-up delay-300" style={{
        padding: '64px 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
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
        /* 产品展示模块样式 */
        .products-section {
          padding: 80px 0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }

        .products-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .products-eyebrow {
          color: var(--brand);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .products-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
          background: linear-gradient(135deg, var(--foreground) 0%, rgba(26, 32, 44, 0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .products-subtitle {
          font-size: 17px;
          color: rgba(26, 32, 44, 0.6);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .product-card {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 36px 32px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }

        .product-card:hover {
          transform: translateY(-8px);
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(37, 99, 235, 0.08);
        }

        .product-card-category {
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .product-card-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0;
          color: var(--foreground);
          transition: color 0.3s ease;
        }

        .product-card:hover .product-card-title {
          color: var(--brand);
        }

        .product-card-description {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(26, 32, 44, 0.65);
          margin: 0;
          flex-grow: 1;
        }

        .product-card-action {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--brand);
          margin-top: 8px;
          transition: gap 0.3s ease;
        }

        .product-card-action svg {
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-card-action {
          gap: 12px;
        }

        .product-card:hover .product-card-action svg {
          transform: translateX(4px);
        }

        .product-card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.03) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .product-card:hover .product-card-glow {
          opacity: 1;
        }

        .products-footer {
          text-align: center;
        }

        .products-view-all {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: var(--gradient-primary);
          color: white;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 999px;
          box-shadow: 0 4px 16px var(--brand-glow);
          transition: all 0.3s ease;
        }

        .products-view-all:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--brand-glow);
        }

        .products-view-all svg {
          transition: transform 0.3s ease;
        }

        .products-view-all:hover svg {
          transform: translateX(4px);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 响应式适配 */
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .product-card:nth-child(3) {
            grid-column: 1 / -1;
            max-width: 50%;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .products-section {
            padding: 60px 0;
          }

          .products-header {
            margin-bottom: 40px;
          }

          .products-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .product-card:nth-child(3) {
            grid-column: auto;
            max-width: none;
          }

          .product-card {
            padding: 28px 24px;
          }

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

          .about-section {
            padding: 56px 0;
          }

          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .home-news-section {
            padding: 48px 0;
          }
        }

        @media (max-width: 480px) {
          .products-section {
            padding: 48px 0;
          }

          .about-section {
            padding: 40px 0;
          }

          .about-pillars {
            grid-template-columns: 1fr;
          }

          .home-news-section {
            padding: 36px 0;
          }
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
      `}} />
    </>
  );
}
