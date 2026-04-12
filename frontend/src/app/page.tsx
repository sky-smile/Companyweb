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
        padding: '80px 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* 新闻区域 */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <SectionHeading eyebrow="新闻动态" title="最新资讯" description="了解公司最新发展、行业趋势及重要事项公告" />
            </div>
            <div className="news-list">
              {news.list.slice(0, 3).map((item, index) => {
                const date = new Date(item.publishedAt || '');
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0') + '月';
                const year = date.getFullYear();
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="news-card"
                    style={{ animationDelay: `${index * 100}ms`, maxWidth: 800, margin: '0 auto' }}
                  >
                    <div className="news-body">
                      <div className="news-date">
                        <span className="news-day">{day}</span>
                        <span className="news-month">{month}</span>
                        <span className="news-year">{year}</span>
                      </div>
                      <div className="news-content">
                        <div className="news-header">
                          <h3 className="news-title">{item.title}</h3>
                          <span className="news-category">{item.categoryName || '新闻'}</span>
                        </div>
                        <p className="news-summary">{item.summary || '暂无摘要信息'}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* 查看全部新闻 */}
            <div className="news-footer" style={{ textAlign: 'center' }}>
              <Link href="/news" className="news-view-all">
                查看更多新闻
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 公告区域 */}
          <div>
            <SectionHeading eyebrow="通知公告" title="官方公告" description="发布重要通知、业务变更及合作伙伴相关公告信息" />
            <div className="announcement-list">
              {announcements.list.slice(0, 4).map((item, index) => {
                const date = new Date(item.publishedAt || '');
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0') + '月';
                const year = date.getFullYear();
                return (
                  <Link
                    key={item.id}
                    href={`/announcements/${item.id}`}
                    className="announcement-card"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="announcement-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                    </div>
                    <div className="announcement-content">
                      <h3 className="announcement-title">{item.title}</h3>
                      <p className="announcement-summary">{item.summary || '暂无摘要信息'}</p>
                    </div>
                    <div className="announcement-date">
                      <span>{day} {month}</span>
                      <span>{year}</span>
                    </div>
                    <div className="announcement-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
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

        /* 新闻模块样式 - 单列布局 */
        .news-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .news-card {
          display: flex;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
          position: relative;
          overflow: hidden;
        }

        .news-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--brand-soft), rgba(37, 99, 235, 0.1));
          transition: width 0.3s ease;
        }

        .news-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        .news-card:hover::before {
          width: 8px;
        }

        .news-body {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 28px;
          width: 100%;
        }

        .news-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 68px;
          padding: 12px 16px;
          background: linear-gradient(135deg, var(--brand-soft) 0%, rgba(37, 99, 235, 0.08) 100%);
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
          border: 1px solid rgba(37, 99, 235, 0.1);
        }

        .news-card:hover .news-date {
          background: linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);
          border-color: rgba(37, 99, 235, 0.3);
          color: white;
          transform: scale(1.05);
        }

        .news-day {
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          color: var(--brand);
          transition: color 0.3s ease;
        }

        .news-card:hover .news-day {
          color: white;
        }

        .news-month {
          font-size: 13px;
          font-weight: 600;
          margin: 4px 0;
          color: var(--brand);
          opacity: 0.9;
          transition: color 0.3s ease;
        }

        .news-card:hover .news-month {
          color: white;
        }

        .news-year {
          font-size: 11px;
          color: var(--text-muted);
          transition: color 0.3s ease;
          font-weight: 500;
        }

        .news-card:hover .news-year {
          color: rgba(255, 255, 255, 0.8);
        }

        .news-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .news-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 4px;
        }

        .news-title {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.4;
          color: var(--foreground);
          margin: 0;
          transition: color 0.3s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
          min-width: 0;
        }

        .news-card:hover .news-title {
          color: var(--brand);
        }

        .news-category {
          font-size: 12px;
          font-weight: 600;
          color: var(--brand);
          background: rgba(37, 99, 235, 0.1);
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
          border: 1px solid rgba(37, 99, 235, 0.2);
          transition: all 0.3s ease;
        }

        .news-card:hover .news-category {
          background: var(--brand);
          color: white;
          border-color: var(--brand);
          transform: translateY(-1px);
        }

        .news-summary {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 64px;
        }

        /* 新闻查看全部按钮 */
        .news-footer {
          text-align: center;
          margin-top: 48px;
        }

        .news-view-all {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: var(--surface);
          color: var(--brand);
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 999px;
          border: 2px solid rgba(37, 99, 235, 0.2);
          transition: all 0.3s ease;
        }

        .news-view-all:hover {
          background: var(--brand);
          color: white;
          border-color: var(--brand);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--brand-glow);
        }

        .news-view-all svg {
          transition: transform 0.3s ease;
        }

        .news-view-all:hover svg {
          transform: translateX(4px);
        }

        /* 公告模块样式 */
        .announcement-list {
          display: grid;
          gap: 12px;
        }

        .announcement-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 28px;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }

        .announcement-card:hover {
          border-color: rgba(245, 158, 11, 0.4);
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.1);
          transform: translateX(8px);
        }

        .announcement-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #f59e0b;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .announcement-card:hover .announcement-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          transform: scale(1.1) rotate(10deg);
        }

        .announcement-content {
          flex: 1;
          min-width: 0;
        }

        .announcement-title {
          font-size: 15px;
          font-weight: 600;
          line-height: 1.5;
          color: var(--foreground);
          margin: 0 0 4px;
          transition: color 0.3s ease;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .announcement-card:hover .announcement-title {
          color: #f59e0b;
        }

        .announcement-summary {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-muted);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .announcement-date {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          padding: 8px 16px;
          font-size: 13px;
          color: var(--text-muted);
          background: var(--surface);
          border-radius: 8px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .announcement-card:hover .announcement-date {
          background: #fef3c7;
          color: #92400e;
        }

        .announcement-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--surface);
          color: var(--text-muted);
          transition: all 0.3s ease;
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-8px);
        }

        .announcement-card:hover .announcement-arrow {
          opacity: 1;
          transform: translateX(0);
          background: #f59e0b;
          color: white;
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

          .news-card {
            flex-direction: column;
          }

          .news-body {
            padding: 20px;
            gap: 16px;
            flex-direction: column;
            align-items: flex-start;
          }

          .news-date {
            min-width: 60px;
            padding: 10px 12px;
            align-self: flex-start;
          }

          .news-day {
            font-size: 24px;
          }

          .news-month {
            font-size: 12px;
          }

          .news-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .news-title {
            font-size: 16px;
            line-height: 1.4;
            -webkit-line-clamp: 2;
          }

          .news-category {
            align-self: flex-start;
          }

          .news-summary {
            font-size: 14px;
            line-height: 1.6;
            -webkit-line-clamp: 2;
            min-height: auto;
          }

          /* 移动端新闻查看全部按钮适配 */
          .news-footer {
            margin-top: 36px;
          }

          .news-view-all {
            padding: 12px 28px;
            font-size: 14px;
          }

          .announcement-card {
            padding: 16px 20px;
            gap: 16px;
          }

          .announcement-icon {
            width: 40px;
            height: 40px;
          }

          .announcement-icon svg {
            width: 20px;
            height: 20px;
          }

          .announcement-title {
            font-size: 14px;
            line-height: 1.4;
          }

          .announcement-summary {
            display: none;
          }

          .announcement-date {
            padding: 6px 10px;
            font-size: 11px;
          }

          .announcement-arrow {
            display: none;
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
