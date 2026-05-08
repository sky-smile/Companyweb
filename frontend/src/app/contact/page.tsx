import type { Metadata } from 'next';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { publicService } from '@/services/public-service';

// ISR：24小时重新验证
export const revalidate = 86400;

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

  const getSettingValue = (key: string) =>
    contact.settings.find(s => s.settingKey === key)?.settingValue || '';

  const siteName = getSettingValue('siteName');
  const address = getSettingValue('contactAddress');
  const email = getSettingValue('contactEmail');
  const phone = getSettingValue('contactPhone');
  const workTime = getSettingValue('contactWorkTime');
  const website = getSettingValue('contactWebsite');

  const hasContact = siteName || address || email || phone;

  return (
    <>
      {/* 页面头部 Hero */}
      <section className="contact-hero">
        <div className="hero-decoration hero-decoration-1" />
        <div className="hero-decoration hero-decoration-2" />
        <div className="hero-decoration hero-decoration-3" />

        <div className="site-shell hero-content">
          <div className="hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Contact Us</span>
          </div>

          <h1 className="hero-title">联系我们</h1>
          <p className="hero-description">
            期待与您的每一次沟通，无论是业务咨询还是合作洽谈，我们都随时恭候。
          </p>

          <div className="hero-cta">
            {phone && (
              <a href={`tel:${phone}`} className="cta-button cta-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{phone}</span>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="cta-button cta-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>发送邮件</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 联系信息网格 */}
      <section className="site-shell contact-section">
        {hasContact ? (
          <div className="contact-grid">
            {/* 主要联系信息卡片 */}
            <div className="contact-card contact-card-primary">
              <div className="card-header">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h2 className="card-title">联系方式</h2>
              </div>

              <div className="contact-list">
                {siteName && (
                  <div className="contact-item">
                    <div className="contact-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-label">公司名称</span>
                      <span className="contact-item-value">{siteName}</span>
                    </div>
                  </div>
                )}

                {phone && (
                  <div className="contact-item">
                    <div className="contact-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-label">联系电话</span>
                      <a href={`tel:${phone}`} className="contact-item-value contact-item-link">
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {email && (
                  <div className="contact-item">
                    <div className="contact-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-label">电子邮箱</span>
                      <a href={`mailto:${email}`} className="contact-item-value contact-item-link">
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="contact-item">
                    <div className="contact-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="contact-item-content">
                      <span className="contact-item-label">公司地址</span>
                      <span className="contact-item-value">{address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 辅助信息卡片 */}
            <div className="contact-sidebar">
              {workTime && (
                <div className="contact-card contact-card-secondary">
                  <div className="card-header">
                    <div className="card-icon card-icon-secondary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <h2 className="card-title">工作时间</h2>
                  </div>
                  <div className="work-time">
                    <div className="work-time-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <span className="work-time-text">{workTime}</span>
                  </div>
                </div>
              )}

              {website && (
                <div className="contact-card contact-card-secondary">
                  <div className="card-header">
                    <div className="card-icon card-icon-secondary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <h2 className="card-title">官方网站</h2>
                  </div>
                  <a href={website} target="_blank" rel="noopener noreferrer" className="website-link">
                    <span>{website.replace(/^https?:\/\//, '')}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              )}

              {/* 快速联系提示 */}
              <div className="contact-card contact-card-tip">
                <div className="tip-content">
                  <div className="tip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div className="tip-text">
                    <strong>温馨提示</strong>
                    <p>我们将在收到您的信息后尽快回复，感谢您的耐心等待。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="contact-empty">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h2>暂无联系信息</h2>
            <p>请联系管理员添加联系信息</p>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ========== Hero 区域 ========== */
        .contact-hero {
          position: relative;
          padding: var(--page-top, 108px) 0 80px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 40%, #ffffff 100%);
          border-bottom: 1px solid var(--line);
        }

        .hero-decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-decoration-1 {
          top: -30%;
          right: -8%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 60%);
          filter: blur(60px);
        }

        .hero-decoration-2 {
          bottom: -20%;
          left: -5%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 60%);
          filter: blur(50px);
        }

        .hero-decoration-3 {
          top: 20%;
          left: 50%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 60%);
          filter: blur(40px);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.15);
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .hero-badge svg {
          width: 16px;
          height: 16px;
          color: var(--brand);
        }

        .hero-badge span {
          font-size: 13px;
          font-weight: 600;
          color: var(--brand);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--foreground);
        }

        .hero-description {
          margin: 20px auto 0;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 520px;
        }

        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
          flex-wrap: wrap;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .cta-button svg {
          width: 20px;
          height: 20px;
        }

        .cta-primary {
          background: var(--brand);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .cta-primary:hover {
          background: var(--brand-dark, #1d4ed8);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .cta-secondary {
          background: #ffffff;
          color: var(--brand);
          border: 1px solid var(--line);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .cta-secondary:hover {
          border-color: var(--brand);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        /* ========== 联系信息区域 ========== */
        .contact-section {
          padding: 72px 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        /* 主卡片 */
        .contact-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid var(--line);
          padding: 32px;
          transition: all 0.3s ease;
        }

        .contact-card-primary {
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
        }

        .contact-card-primary:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--line);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light, #60a5fa) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }

        .card-icon svg {
          width: 24px;
          height: 24px;
        }

        .card-icon-secondary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        }

        .card-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: var(--foreground);
          letter-spacing: -0.02em;
        }

        /* 联系列表 */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(14, 165, 233, 0.02) 100%);
          border: 1px solid rgba(37, 99, 235, 0.06);
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(14, 165, 233, 0.04) 100%);
          border-color: rgba(37, 99, 235, 0.12);
          transform: translateX(6px);
        }

        .contact-item-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--brand);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(37, 99, 235, 0.25);
        }

        .contact-item-icon svg {
          width: 20px;
          height: 20px;
        }

        .contact-item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .contact-item-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--brand);
          letter-spacing: 0.03em;
        }

        .contact-item-value {
          font-size: 15px;
          line-height: 1.5;
          color: var(--foreground);
          word-break: break-word;
        }

        .contact-item-link {
          color: var(--brand);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-item-link:hover {
          color: var(--brand-dark, #1d4ed8);
          text-decoration: underline;
        }

        /* 侧边栏卡片 */
        .contact-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-card-secondary {
          background: #ffffff;
          border: 1px solid var(--line);
          padding: 24px;
        }

        .contact-card-secondary:hover {
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .work-time {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .work-time-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        .work-time-icon svg {
          width: 22px;
          height: 22px;
        }

        .work-time-text {
          font-size: 15px;
          line-height: 1.5;
          color: var(--foreground);
        }

        .website-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: var(--brand);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .website-link:hover {
          color: var(--brand-dark, #1d4ed8);
        }

        .website-link svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }

        .website-link:hover svg {
          transform: translate(2px, -2px);
        }

        /* 提示卡片 */
        .contact-card-tip {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(14, 165, 233, 0.02) 100%);
          border-color: rgba(37, 99, 235, 0.08);
        }

        .tip-content {
          display: flex;
          gap: 14px;
        }

        .tip-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand);
        }

        .tip-icon svg {
          width: 20px;
          height: 20px;
        }

        .tip-text {
          flex: 1;
        }

        .tip-text strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 6px;
        }

        .tip-text p {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-muted);
        }

        /* 空状态 */
        .contact-empty {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand);
        }

        .empty-icon svg {
          width: 40px;
          height: 40px;
        }

        .contact-empty h2 {
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: 600;
          color: var(--foreground);
        }

        .contact-empty p {
          margin: 0;
          font-size: 14px;
          color: var(--text-muted);
        }

        /* ========== 响应式设计 ========== */
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-sidebar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding: var(--page-top, 96px) 0 60px;
          }

          .hero-title {
            font-size: clamp(2rem, 8vw, 2.5rem);
          }

          .hero-description {
            font-size: 15px;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }

          .contact-section {
            padding: 48px 0;
          }

          .contact-card {
            padding: 24px;
          }

          .contact-sidebar {
            grid-template-columns: 1fr;
          }

          .contact-item {
            padding: 16px;
            gap: 12px;
          }

          .contact-item-icon {
            width: 40px;
            height: 40px;
          }

          .contact-item-icon svg {
            width: 18px;
            height: 18px;
          }
        }

        @media (max-width: 480px) {
          .hero-badge {
            padding: 6px 12px;
            margin-bottom: 20px;
          }

          .hero-badge span {
            font-size: 12px;
          }

          .hero-title {
            font-size: 1.875rem;
          }

          .hero-description {
            font-size: 14px;
          }

          .contact-card {
            padding: 20px;
            border-radius: 16px;
          }

          .card-header {
            padding-bottom: 16px;
            margin-bottom: 20px;
          }

          .card-icon {
            width: 42px;
            height: 42px;
          }

          .card-title {
            font-size: 18px;
          }

          .contact-list {
            gap: 14px;
          }

          .contact-item {
            padding: 14px;
          }
        }
      `}} />
    </>
  );
}
