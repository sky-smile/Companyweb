import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { RichContent } from '@/components/RichContent';
import { publicService } from '@/services/public-service';

export async function generateMetadata(): Promise<Metadata> {
  const about = await publicService.getAbout();

  return buildMetadata({
    title: about.seoTitle || about.title || '关于我们',
    description: pickDescription(about.seoDescription, about.content),
    path: '/about',
  });
}

export default async function AboutPage() {
  const about = await publicService.getAbout();

  return (
    <>
      {/* 页面头部 Hero */}
      <section className="about-hero">
        {/* 装饰背景 */}
        <div className="hero-background-decoration" />
        <div className="hero-secondary-decoration" />

        <div className="site-shell hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">About Us</div>
            <h1 className="hero-title">{about.title || '关于我们'}</h1>
            <RichContent
              content={about.content}
              fallback="我们致力于以创新技术和卓越品质，为客户创造可持续的价值，成为行业值得信赖的合作伙伴。"
              className="hero-description"
            />
          </div>
        </div>
      </section>

      {/* 使命 · 愿景 · 价值观 */}
      <section className="about-pillars-section">
        <div className="site-shell">
          <div className="section-header">
            <div className="section-eyebrow">Our Core</div>
            <h2 className="section-title">使命 · 愿景 · 价值观</h2>
          </div>

          <div className="about-pillars">
            {/* 使命 */}
            <div className="about-pillar about-pillar-blue">
              <div className="pillar-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h3 className="pillar-title">使命</h3>
              <p className="pillar-description">
                以技术创新和品质坚守，为客户创造超越期望的价值，推动行业可持续发展。我们相信，每一次突破都源于对卓越的不懈追求。
              </p>
            </div>

            {/* 愿景 */}
            <div className="about-pillar about-pillar-green">
              <div className="pillar-icon-wrapper pillar-icon-green">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="pillar-title">愿景</h3>
              <p className="pillar-description">
                成为全球客户首选的合作伙伴，以专业与诚信构筑值得信赖的品牌形象。立足当下，放眼未来，持续拓展发展边界。
              </p>
            </div>

            {/* 价值观 */}
            <div className="about-pillar about-pillar-red">
              <div className="pillar-icon-wrapper pillar-icon-red">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="pillar-title">价值观</h3>
              <p className="pillar-description">
                品质为先、客户至上、持续创新、合作共赢——每一项决策都以此为准则，确保始终走在正确的道路上。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="about-timeline-section">
        <div className="site-shell">
          <div className="section-header">
            <div className="section-eyebrow">Milestones</div>
            <h2 className="section-title">发展历程</h2>
          </div>

          <div className="about-timeline">
            {/* 时间线竖线 */}
            <div className="timeline-line" />

            {[
              { year: '2009', title: '公司成立', desc: '从一间小办公室起步，怀揣对品质与技术的执着信念，踏上了创业之路。' },
              { year: '2013', title: '技术突破', desc: '核心产品获得行业认证，建立自主研发中心，确立技术领先优势。' },
              { year: '2017', title: '规模扩张', desc: '业务拓展至多个地区，团队规模突破百人，服务体系全面升级。' },
              { year: '2021', title: '数字化转型', desc: '启动数字化战略，引入智能制造与数据驱动决策，运营效率大幅提升。' },
              { year: '2024', title: '品牌焕新', desc: '全新品牌形象上线，持续深耕核心领域，向更广阔的市场迈进。' },
            ].map((item, i) => (
              <div key={item.year} className="about-timeline-item">
                {/* 节点圆点 */}
                <div className="timeline-dot">
                  <div className="timeline-dot-inner" />
                </div>

                <div className="about-timeline-card">
                  <div className="timeline-year">{item.year}</div>
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-description">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 企业数据 */}
      <section className="about-stats-section">
        <div className="site-shell">
          <div className="section-header section-header-center">
            <div className="section-eyebrow">By the Numbers</div>
            <h2 className="section-title">实力见证</h2>
          </div>

          <div className="about-stats">
            {[
              { value: '15+', label: '年行业深耕', sub: '持续稳定发展' },
              { value: '200+', label: '服务客户', sub: '遍布全球各地' },
              { value: '50+', label: '技术团队', sub: '专业研发力量' },
              { value: '99%', label: '客户满意度', sub: '口碑铸就品牌' },
            ].map((stat) => (
              <div key={stat.label} className="about-stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="site-shell">
          <div className="cta-content">
            <h2 className="cta-title">期待与您携手共创未来</h2>
            <p className="cta-description">
              无论您有任何合作意向或咨询需求，我们都乐意为您提供专业的解决方案。
            </p>
            <Link href="/contact" className="about-cta-btn">
              联系我们
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 样式 */}
      <style jsx>{`
        /* ========== 页面头部 Hero ========== */
        .about-hero {
          position: relative;
          padding-top: var(--page-top, 108px);
          padding-bottom: 64px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 50%, #ffffff 100%);
          border-bottom: 1px solid var(--line);
        }

        .hero-background-decoration {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .hero-secondary-decoration {
          position: absolute;
          bottom: -10%;
          left: -5%;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-text {
          max-width: 800px;
        }

        .hero-eyebrow {
          color: var(--brand);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }

        .hero-description {
          margin-top: 24px;
          font-size: clamp(1rem, 1.6vw, 1.15rem);
          line-height: 1.8;
          max-width: 640px;
          color: var(--text-secondary);
        }

        .hero-description :global(p) {
          margin: 0;
        }

        /* ========== 通用区块样式 ========== */
        .section-header {
          margin-bottom: 48px;
        }

        .section-header-center {
          text-align: center;
        }

        .section-eyebrow {
          color: var(--brand);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .section-title {
          margin: 0;
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        /* ========== 使命 · 愿景 · 价值观 ========== */
        .about-pillars-section {
          padding: 80px 0;
        }

        .about-pillars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .about-pillar {
          padding: 44px 36px;
          border-radius: var(--radius-lg);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .about-pillar-blue {
          background: linear-gradient(160deg, #f0f7ff 0%, #ffffff 60%);
          border: 1px solid rgba(37, 99, 235, 0.08);
        }

        .about-pillar-blue:hover {
          border-color: rgba(37, 99, 235, 0.2);
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.12);
        }

        .about-pillar-green {
          background: linear-gradient(160deg, #f0fdf4 0%, #ffffff 60%);
          border: 1px solid rgba(22, 163, 74, 0.08);
        }

        .about-pillar-green:hover {
          border-color: rgba(22, 163, 74, 0.2);
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(22, 163, 74, 0.12);
        }

        .about-pillar-red {
          background: linear-gradient(160deg, #fef3f2 0%, #ffffff 60%);
          border: 1px solid rgba(220, 38, 38, 0.08);
        }

        .about-pillar-red:hover {
          border-color: rgba(220, 38, 38, 0.2);
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(220, 38, 38, 0.12);
        }

        .pillar-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: var(--brand-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s ease;
        }

        .about-pillar:hover .pillar-icon-wrapper {
          transform: scale(1.1);
        }

        .pillar-icon-green {
          background: rgba(22, 163, 74, 0.08);
        }

        .pillar-icon-red {
          background: rgba(220, 38, 38, 0.08);
        }

        .pillar-title {
          margin: 0 0 14px;
          font-size: 22px;
          font-weight: 700;
          color: var(--foreground);
        }

        .pillar-description {
          margin: 0;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        /* ========== 发展历程 ========== */
        .about-timeline-section {
          padding: 80px 0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .about-timeline {
          position: relative;
          padding-left: 40px;
        }

        .timeline-line {
          position: absolute;
          left: 11px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(180deg, var(--brand) 0%, var(--accent) 100%);
          border-radius: 1px;
        }

        .about-timeline-item {
          position: relative;
          padding-bottom: 40px;
        }

        .about-timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -40px;
          top: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid var(--brand);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .about-timeline-item:hover .timeline-dot {
          background: var(--brand);
          transform: scale(1.2);
        }

        .timeline-dot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--brand);
          transition: background 0.3s ease;
        }

        .about-timeline-item:hover .timeline-dot-inner {
          background: #ffffff;
        }

        .about-timeline-card {
          padding: 24px 28px;
          border-radius: var(--radius-md);
          border: 1px solid var(--line);
          background: #ffffff;
          transition: all 0.3s ease;
        }

        .about-timeline-card:hover {
          border-color: var(--brand);
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
          transform: translateX(4px);
        }

        .timeline-year {
          font-size: 13px;
          font-weight: 700;
          color: var(--brand);
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .timeline-title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
          color: var(--foreground);
        }

        .timeline-description {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        /* ========== 企业数据 ========== */
        .about-stats-section {
          padding: 80px 0;
        }

        .about-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
        }

        .about-stat-card {
          padding: 40px 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--line);
          background: #ffffff;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .about-stat-card:hover {
          border-color: var(--brand);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
        }

        .stat-value {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          color: var(--brand);
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .stat-label {
          margin-top: 12px;
          font-size: 16px;
          font-weight: 600;
          color: var(--foreground);
        }

        .stat-sub {
          margin-top: 6px;
          font-size: 13px;
          color: var(--text-muted);
        }

        /* ========== CTA ========== */
        .about-cta {
          padding: 64px 0;
          background: var(--gradient-primary);
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .about-cta::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-content {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .cta-title {
          margin: 0 0 16px;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .cta-description {
          margin: 0 0 32px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.7;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }

        .about-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .about-cta-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .about-cta-btn span {
          transition: transform 0.3s ease;
        }

        .about-cta-btn:hover span {
          transform: translateX(4px);
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 768px) {
          .about-hero {
            padding-top: var(--page-top, 96px);
            padding-bottom: 48px;
          }

          .hero-background-decoration {
            width: 350px;
            height: 350px;
            top: -15%;
            right: -15%;
          }

          .hero-secondary-decoration {
            width: 300px;
            height: 300px;
            bottom: -10%;
            left: -10%;
          }

          .hero-description {
            font-size: 1rem;
          }

          .about-pillars-section,
          .about-timeline-section,
          .about-stats-section {
            padding: 60px 0;
          }

          .section-header {
            margin-bottom: 36px;
          }

          .about-pillars {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .about-pillar {
            padding: 32px 28px;
          }

          .about-timeline {
            padding-left: 32px;
          }

          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .about-stat-card {
            padding: 28px 16px;
          }

          .about-cta {
            padding: 48px 0;
          }

          .cta-description {
            font-size: 15px;
            margin-bottom: 28px;
          }

          .about-cta-btn {
            padding: 14px 32px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .about-hero {
            padding-top: var(--page-top, 88px);
            padding-bottom: 40px;
          }

          .hero-eyebrow {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .hero-description {
            font-size: 0.95rem;
            line-height: 1.7;
          }

          .about-pillar {
            padding: 28px 20px;
          }

          .pillar-icon-wrapper {
            width: 48px;
            height: 48px;
            margin-bottom: 20px;
          }

          .pillar-icon-wrapper svg {
            width: 24px;
            height: 24px;
          }

          .pillar-title {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .about-timeline {
            padding-left: 28px;
          }

          .timeline-dot {
            width: 20px;
            height: 20px;
            border-width: 2px;
          }

          .timeline-dot-inner {
            width: 6px;
            height: 6px;
          }

          .about-timeline-card {
            padding: 18px 20px;
          }

          .timeline-title {
            font-size: 16px;
          }

          .timeline-description {
            font-size: 14px;
          }

          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .about-stat-card {
            padding: 24px 12px;
          }

          .stat-label {
            font-size: 14px;
          }

          .stat-sub {
            font-size: 12px;
          }

          .about-cta {
            padding: 40px 0;
          }

          .cta-title {
            font-size: 1.4rem;
          }

          .cta-description {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
