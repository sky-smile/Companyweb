'use client';

import Link from 'next/link';
import Image from 'next/image';

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
      {/* 主内容区 */}
      <div className="site-shell footer-main">
        {/* 品牌介绍区 */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            {siteLogo && (
              <Image
                src={siteLogo}
                alt={siteName || 'Company Logo'}
                width={72}
                height={72}
                className="footer-logo-img"
              />
            )}
            {siteLogo && siteName && <span className="footer-logo-divider" />}
            {siteName && <span className="footer-logo-text">{siteName}</span>}
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
            <h4 className="footer-contact-title">联系方式</h4>
            <div className="footer-contact-list">
              {contactAddress && (
                <div className="contact-info-item">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="contact-text">{contactAddress}</span>
                </div>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="contact-info-item contact-info-link">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="contact-text">{contactPhone}</span>
                </a>
              )}
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="contact-info-item contact-info-link">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="contact-text">{contactEmail}</span>
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
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          color: #1e293b;
          position: relative;
          margin-top: auto;
          border-top: 1px solid #e2e8f0;
        }

        .footer-main {
          padding: 72px 0 56px;
          display: grid;
          grid-template-columns: 1.3fr 1.5fr 1.2fr;
          gap: 64px;
          align-items: start;
        }

        /* 品牌区 */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          transition: opacity 0.25s ease;
        }

        .footer-logo:hover {
          opacity: 0.8;
        }

        .footer-logo-img {
          width: 72px;
          height: 72px;
          border-radius: 12px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .footer-logo-divider {
          width: 1px;
          height: 28px;
          background: #cbd5e1;
          flex-shrink: 0;
        }

        .footer-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .footer-description {
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
          margin: 0;
          max-width: 300px;
        }

        /* 链接区域 */
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .footer-links-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-links-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 8px;
        }

        .footer-links-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          border-radius: 2px;
        }

        .footer-links-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          color: #475569;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
          position: relative;
          padding-left: 0;
        }

        .footer-link::before {
          content: '→';
          position: absolute;
          left: -16px;
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.25s ease;
          color: #3b82f6;
        }

        .footer-link:hover {
          color: #3b82f6;
          padding-left: 20px;
        }

        .footer-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        /* 联系方式区域 */
        .footer-contact-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-contact-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 8px;
        }

        .footer-contact-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          border-radius: 2px;
        }

        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
          text-decoration: none;
          transition: all 0.25s ease;
          padding: 4px 0;
        }

        .contact-info-link {
          cursor: pointer;
        }

        .contact-info-item:hover {
          color: #3b82f6;
          transform: translateX(4px);
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: #3b82f6;
          margin-top: 2px;
          transition: transform 0.25s ease;
        }

        .contact-info-item:hover .contact-icon {
          transform: scale(1.15) rotate(5deg);
        }

        .contact-text {
          flex: 1;
        }

        /* 底部版权区 */
        .footer-bottom {
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .footer-bottom-inner {
          padding: 24px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .copyright {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          text-align: center;
          letter-spacing: 0.02em;
        }

        /* 响应式适配 */
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
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
            padding: 56px 0 40px;
            gap: 40px;
          }

          .footer-links {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .footer-links-column {
            gap: 16px;
          }

          .footer-links-title {
            font-size: 14px;
          }

          .footer-contact-list {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .footer-bottom-inner {
            padding: 20px 0;
          }

          .copyright {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .footer-main {
            padding: 48px 0 32px;
            gap: 32px;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 20px;
          }

          .footer-links-title {
            font-size: 13px;
          }

          .footer-link {
            font-size: 13px;
          }

          .footer-description {
            font-size: 14px;
          }

          .contact-info-item {
            font-size: 13px;
          }

          .contact-icon {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </footer>
  );
}
