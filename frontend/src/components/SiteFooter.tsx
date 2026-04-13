'use client';

import Link from 'next/link';

interface SiteFooterProps {
  siteName?: string;
  siteLogo?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  copyrightText?: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: '产品服务',
    links: [
      { label: '产品中心', href: '/products' },
      { label: '技术支持', href: '/contact' },
    ],
  },
  {
    title: '关于我们',
    links: [
      { label: '公司简介', href: '/about' },
      { label: '联系我们', href: '/contact' },
    ],
  },
  {
    title: '新闻资讯',
    links: [
      { label: '企业新闻', href: '/news' },
      { label: '公告通知', href: '/announcements' },
    ],
  },
];

export function SiteFooter({
  siteName,
  siteLogo,
  contactPhone,
  contactEmail,
  contactAddress,
  copyrightText,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const copyright = copyrightText || `© ${currentYear} ${siteName || 'Sky Smile'}. All rights reserved.`;

  return (
    <footer className="site-footer">
      {/* 顶部装饰线 */}
      <div className="footer-top-line" />

      {/* 主内容区 */}
      <div className="site-shell footer-main">
        {/* 品牌介绍区 */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            {siteLogo ? (
              <img
                src={siteLogo}
                alt={siteName || 'Company Logo'}
                style={{ maxWidth: 160, maxHeight: 40, height: 'auto', objectFit: 'contain' }}
              />
            ) : (
              siteName || 'Sky Smile'
            )}
          </Link>
          <p className="footer-description">
            专注于为企业提供高品质的产品与解决方案，致力于成为行业领先的合作伙伴。
          </p>
        </div>

        {/* 链接区域 */}
        <div className="footer-links">
          {footerSections.map((section) => (
            <div key={section.title} className="footer-links-column">
              <h4 className="footer-links-title">{section.title}</h4>
              <ul className="footer-links-list">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 联系方式区域 */}
        {(contactPhone || contactEmail || contactAddress) && (
          <div className="footer-contact-section">
            <h4 className="footer-contact-title">联系我们</h4>
            <div className="footer-contact-list">
              {contactAddress && (
                <div className="contact-info-item">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{contactAddress}</span>
                </div>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="contact-info-item contact-info-link">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{contactPhone}</span>
                </a>
              )}
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="contact-info-item contact-info-link">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>{contactEmail}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部版权区 */}
      <div className="footer-bottom">
        <div className="site-shell footer-bottom-inner">
          <p className="copyright">{copyright}</p>
        </div>
      </div>

      {/* 样式 */}
      <style>{`
        .site-footer {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-top: 1px solid var(--line);
          position: relative;
        }

        .footer-top-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(37, 99, 235, 0.2) 15%,
            rgba(37, 99, 235, 0.4) 50%,
            rgba(37, 99, 235, 0.2) 85%,
            transparent 100%
          );
        }

        .footer-main {
          padding: 64px 0 48px;
          display: grid;
          grid-template-columns: 1.2fr 1.5fr 1.3fr;
          gap: 48px;
          align-items: start;
        }

        /* 品牌区 */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          transition: opacity 0.3s ease;
          display: inline-flex;
          align-items: center;
        }

        .footer-logo:hover {
          opacity: 0.85;
        }

        .footer-logo img {
          max-width: 160px;
          height: auto;
        }

        .footer-description {
          color: rgba(26, 32, 44, 0.65);
          font-size: 14px;
          line-height: 1.7;
          margin: 0;
          max-width: 280px;
        }

        /* 链接区 */
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .footer-links-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-links-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--foreground);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .footer-links-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          color: rgba(26, 32, 44, 0.6);
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: var(--brand);
          transform: translateX(4px);
        }

        /* 联系方式区域 */
        .footer-contact-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-contact-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--foreground);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: rgba(26, 32, 44, 0.6);
          font-size: 14px;
          line-height: 1.5;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .contact-info-link {
          cursor: pointer;
        }

        .contact-info-link:hover {
          color: var(--brand);
        }

        .contact-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: var(--brand);
          margin-top: 2px;
        }

        /* 底部版权区 */
        .footer-bottom {
          border-top: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.5);
        }

        .footer-bottom-inner {
          padding: 20px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .copyright {
          font-size: 13px;
          color: rgba(26, 32, 44, 0.5);
          margin: 0;
          text-align: center;
        }

        /* 响应式适配 */
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .footer-brand {
            grid-column: 1 / -1;
            text-align: center;
            align-items: center;
          }

          .footer-description {
            max-width: 100%;
          }

          .footer-contact-section {
            grid-column: 1 / -1;
          }

          .footer-contact-list {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr;
            padding: 48px 0 32px;
            gap: 36px;
          }

          .footer-links {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .footer-links-column {
            gap: 12px;
          }

          .footer-contact-list {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          .footer-bottom-inner {
            padding: 18px 0;
          }

          .copyright {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 16px;
          }

          .footer-links-column:last-child {
            grid-column: 1 / -1;
          }

          .footer-main {
            padding: 40px 0 28px;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
