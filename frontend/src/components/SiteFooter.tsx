'use client';

import Link from 'next/link';

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
      { label: '解决方案', href: '/products' },
      { label: '技术支持', href: '/contact' },
    ],
  },
  {
    title: '关于我们',
    links: [
      { label: '公司简介', href: '/about' },
      { label: '发展历程', href: '/about' },
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

const socialLinks = [
  {
    name: '微信',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
      </svg>
    ),
  },
  {
    name: '微博',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.401-.649.386-1.031.426-1.922.008-2.557-.781-1.19-2.924-1.126-5.354-.034 0 0-.767.334-.571-.271.378-1.207.321-2.217-.267-2.8-1.336-1.32-4.887.047-7.93 3.052C1.634 10.848.312 13.24.312 15.348c0 4.031 5.179 6.484 10.244 6.484 6.635 0 11.052-3.852 11.052-6.912 0-1.848-1.566-2.898-2.549-3.271zm-.967-5.743c.654-.672.987-1.511.987-2.493 0-1.024-.371-1.897-1.104-2.607-.732-.711-1.662-1.066-2.774-1.066-1.093 0-2.008.355-2.73 1.055-.724.703-1.082 1.576-1.082 2.607 0 .99.354 1.834 1.063 2.508.708.676 1.621 1.013 2.749 1.013 1.127 0 2.041-.339 2.891-1.017zm-1.762-1.27c-.299.334-.696.501-1.191.501-.486 0-.874-.164-1.162-.49-.289-.327-.433-.739-.433-1.232 0-.494.144-.906.433-1.232.288-.326.676-.489 1.162-.489.495 0 .892.165 1.191.496.299.33.448.743.448 1.225 0 .482-.149.898-.448 1.221z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* 顶部装饰线 */}
      <div className="footer-top-line" />

      {/* 主内容区 */}
      <div className="site-shell footer-main">
        {/* 品牌介绍区 */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            Sky Smile
          </Link>
          <p className="footer-description">
            专注于为企业提供高品质的产品与解决方案，致力于成为行业领先的合作伙伴。
          </p>
          <div className="footer-contact">
            <div className="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>400-888-8888</span>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>contact@skysmile.com</span>
            </div>
          </div>
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

        {/* 社交媒体 */}
        <div className="footer-social">
          <h4 className="footer-links-title">关注我们</h4>
          <div className="social-icons">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="social-link"
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="footer-qr-hint">扫码关注公众号</p>
        </div>
      </div>

      {/* 底部版权区 */}
      <div className="footer-bottom">
        <div className="site-shell footer-bottom-inner">
          <p className="copyright">
            © {currentYear} Sky Smile. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="#" className="footer-bottom-link">隐私政策</Link>
            <span className="divider">|</span>
            <Link href="#" className="footer-bottom-link">使用条款</Link>
            <span className="divider">|</span>
            <Link href="#" className="footer-bottom-link">网站地图</Link>
          </div>
        </div>
      </div>

      {/* 样式 */}
      <style>{`
        .site-footer {
          margin-top: var(--footer-spacing, 64px);
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
          grid-template-columns: 1.5fr 2fr 0.8fr;
          gap: 48px;
          align-items: start;
        }

        /* 品牌区 */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          display: inline-block;
        }

        .footer-logo:hover {
          opacity: 0.8;
        }

        .footer-description {
          color: rgba(26, 32, 44, 0.65);
          font-size: 15px;
          line-height: 1.7;
          margin: 0;
          max-width: 280px;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(26, 32, 44, 0.6);
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .contact-item svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: var(--brand);
        }

        .contact-item:hover {
          color: var(--brand);
        }

        /* 链接区 */
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
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
          gap: 12px;
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

        /* 社交媒体区 */
        .footer-social {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .social-icons {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(26, 32, 44, 0.6);
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .social-link:hover {
          border-color: var(--brand);
          background: var(--brand-soft);
          color: var(--brand);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .footer-qr-hint {
          font-size: 12px;
          color: rgba(26, 32, 44, 0.45);
          margin: 8px 0 0;
        }

        /* 底部版权区 */
        .footer-bottom {
          border-top: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.5);
        }

        .footer-bottom-inner {
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .copyright {
          font-size: 13px;
          color: rgba(26, 32, 44, 0.5);
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-bottom-link {
          font-size: 13px;
          color: rgba(26, 32, 44, 0.5);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-bottom-link:hover {
          color: var(--brand);
        }

        .divider {
          color: rgba(26, 32, 44, 0.25);
          font-size: 13px;
        }

        /* 响应式适配 */
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr 1.5fr;
            gap: 40px;
          }

          .footer-social {
            grid-column: 1 / -1;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding-top: 32px;
            border-top: 1px solid var(--line);
          }

          .footer-qr-hint {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .site-footer {
            margin-top: var(--footer-spacing-mobile, 48px);
          }

          .footer-main {
            grid-template-columns: 1fr;
            padding: 48px 0 32px;
            gap: 40px;
          }

          .footer-brand {
            text-align: center;
            align-items: center;
          }

          .footer-description {
            max-width: 100%;
          }

          .footer-contact {
            align-items: center;
          }

          .footer-links {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .footer-links-column {
            gap: 12px;
          }

          .footer-social {
            grid-column: auto;
            flex-direction: column;
            padding-top: 0;
            border-top: none;
            text-align: center;
          }

          .footer-bottom-inner {
            flex-direction: column;
            text-align: center;
            padding: 20px 0;
          }

          .footer-bottom-links {
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 16px;
          }

          .footer-links-column:last-child {
            grid-column: 1 / -1;
          }

          .footer-bottom-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
