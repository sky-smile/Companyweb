import type { Metadata } from 'next';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { RichContent } from '@/components/RichContent';
import { publicService } from '@/services/public-service';

export async function generateMetadata(): Promise<Metadata> {
  const contact = await publicService.getContact();

  return buildMetadata({
    title: contact.page.seoTitle || contact.page.title || '联系我们',
    description: pickDescription(contact.page.seoDescription, contact.page.content),
    path: '/contact',
  });
}

export default async function ContactPage() {
  const contact = await publicService.getContact();

  return (
    <>
      {/* 页面头部 Hero */}
      <section className="contact-hero">
        {/* 背景装饰 */}
        <div className="hero-background-decoration" />
        <div className="hero-secondary-decoration" />

        <div className="site-shell hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">Contact</div>
            <h1 className="hero-title">{contact.page.title || '联系我们'}</h1>
            <RichContent
              content={contact.page.content}
              fallback="请在后台维护公司地址、邮箱、电话与地图嵌入说明。"
              className="hero-description"
            />
          </div>
        </div>
      </section>

      {/* 联系信息卡片 */}
      <section className="site-shell contact-info-section">
        <div className="contact-info-grid">
          {contact.settings.map((item, index) => (
            <div key={item.settingKey} className="contact-info-card">
              {/* 卡片图标 */}
              <div className="contact-info-icon">
                {getContactIcon(index)}
              </div>
              
              {/* 卡片内容 */}
              <div className="contact-info-content">
                <div className="contact-info-label">
                  {item.description || item.settingKey}
                </div>
                <div className="contact-info-value">
                  {item.settingValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 样式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ========== 页面头部 Hero ========== */
        .contact-hero {
          position: relative;
          padding-top: var(--page-top, 108px);
          padding-bottom: 56px;
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
          bottom: -15%;
          left: -5%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-text {
          max-width: 700px;
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
          font-size: clamp(2.25rem, 5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }

        .hero-description {
          margin-top: 18px;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 600px;
        }

        .hero-description p {
          margin: 0;
        }

        /* ========== 联系信息区域 ========== */
        .contact-info-section {
          padding-top: 72px;
          padding-bottom: 72px;
        }

        .contact-info-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }

        /* ========== 联系信息卡片 ========== */
        .contact-info-card {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 28px;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: #ffffff;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .contact-info-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--brand), var(--accent));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 2px;
        }

        .contact-info-card:hover {
          border-color: rgba(37, 99, 235, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .contact-info-card:hover::before {
          opacity: 1;
        }

        /* 图标 */
        .contact-info-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--brand-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand);
          transition: all 0.3s ease;
        }

        .contact-info-card:hover .contact-info-icon {
          background: var(--brand);
          color: #ffffff;
          transform: scale(1.05);
        }

        .contact-info-icon svg {
          width: 24px;
          height: 24px;
        }

        /* 内容 */
        .contact-info-content {
          flex: 1;
          min-width: 0;
        }

        .contact-info-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--brand);
          margin-bottom: 10px;
          letter-spacing: 0.03em;
        }

        .contact-info-value {
          margin: 0;
          font-size: 16px;
          line-height: 1.7;
          color: var(--foreground);
          word-break: break-word;
        }

        .contact-info-value a {
          color: var(--brand);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-info-value a:hover {
          color: var(--brand-light);
          text-decoration: underline;
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 1024px) {
          .contact-info-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
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

          .hero-title {
            font-size: clamp(1.75rem, 6vw, 2.25rem);
          }

          .hero-description {
            font-size: 15px;
            margin-top: 14px;
          }

          .contact-info-section {
            padding-top: 48px;
            padding-bottom: 48px;
          }

          .contact-info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .contact-info-card {
            padding: 20px;
          }

          .contact-info-icon {
            width: 44px;
            height: 44px;
          }

          .contact-info-icon svg {
            width: 22px;
            height: 22px;
          }

          .contact-info-label {
            font-size: 12px;
            margin-bottom: 8px;
          }

          .contact-info-value {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .hero-eyebrow {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .hero-description {
            font-size: 14px;
            line-height: 1.6;
          }

          .contact-info-card {
            padding: 18px;
            gap: 16px;
          }

          .contact-info-icon {
            width: 40px;
            height: 40px;
          }

          .contact-info-icon svg {
            width: 20px;
            height: 20px;
          }

          .contact-info-value {
            font-size: 14px;
          }
        }
      `}} />
    </>
  );
}

/**
 * 根据索引返回对应的 SVG 图标
 */
function getContactIcon(index: number) {
  const icons = [
    // 地址图标
    <svg key="location" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>,
    // 邮箱图标
    <svg key="mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>,
    // 电话图标
    <svg key="phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>,
    // 网站图标
    <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>,
    // 工作时间图标
    <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>,
  ];

  return icons[index % icons.length];
}
