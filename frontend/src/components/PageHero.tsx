'use client';

import { ReactNode } from 'react';

interface PageHeroProps {
  /** 页面英文标签 (如: About Us) */
  badge?: string;
  /** 页面主标题 */
  title: string;
  /** 页面描述 */
  description?: string;
  /** 额外的 CTA 按钮 */
  actions?: ReactNode;
  /** 额外的 CSS 类 */
  className?: string;
}

export function PageHero({ badge, title, description, actions, className = '' }: PageHeroProps) {
  return (
    <>
      <section className={`page-hero ${className}`}>
        <div className="hero-decoration hero-decoration-1" />
        <div className="hero-decoration hero-decoration-2" />
        <div className="hero-decoration hero-decoration-3" />

        <div className="site-shell hero-content">
          {badge && (
            <div className="hero-badge">
              <span>{badge}</span>
            </div>
          )}
          <h1 className="hero-title">{title}</h1>
          {description && (
            <p className="hero-description">{description}</p>
          )}
          {actions && (
            <div className="hero-actions">
              {actions}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          position: relative;
          padding: var(--page-top, 108px) 0 72px;
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
          max-width: 720px;
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
          max-width: 560px;
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 768px) {
          .page-hero {
            padding: var(--page-top, 96px) 0 56px;
          }

          .hero-badge {
            padding: 6px 14px;
            margin-bottom: 20px;
          }

          .hero-badge span {
            font-size: 12px;
          }

          .hero-description {
            font-size: 15px;
          }

          .hero-actions {
            margin-top: 24px;
          }
        }

        @media (max-width: 480px) {
          .page-hero {
            padding: var(--page-top, 88px) 0 48px;
          }

          .hero-description {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
