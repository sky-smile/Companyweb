import Link from 'next/link';
import type { BannerItem } from '@/types/public';

interface HeroBannerProps {
  banners: BannerItem[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const banner = banners[0];

  return (
    <section 
      className="hero-banner"
      style={{
        position: 'relative',
        minHeight: 520,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 背景图片 */}
      {banner?.imageUrl && (
        <div 
          className="hero-bg"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${banner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      
      {/* 渐变遮罩 */}
      <div 
        className="hero-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        }}
      />

      {/* 内容 */}
      <div className="site-shell" style={{ position: 'relative', zIndex: 1, padding: '60px 0' }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--brand)',
            letterSpacing: '0.2em',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 16 }}>🚀</span>
            INDUSTRIAL BRAND STORY
          </div>

          <h1 style={{
            margin: 0,
            fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--foreground)',
          }}>
            {banner?.title || 'Reliable manufacturing, presented with clarity.'}
          </h1>

          <p style={{
            margin: '20px 0 0',
            maxWidth: 640,
            fontSize: 18,
            color: 'rgba(26, 32, 44, 0.7)',
            lineHeight: 1.7,
          }}>
            {banner?.subtitle || 'A modern company website that highlights product capability, company story, and the latest updates for global visitors.'}
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 36 }}>
            <Link
              href="/products"
              className="hero-btn-primary"
            >
              查看产品
              <span style={{ fontSize: 18 }}>→</span>
            </Link>
            <Link
              href="/contact"
              className="hero-btn-secondary"
            >
              联系我们
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-banner {
          position: relative;
        }
        
        .hero-bg {
          transition: opacity 0.5s ease;
        }
        
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(10, 14, 26, 0.3) 100%);
        }
        
        .hero-overlay {
          backdrop-filter: blur(2px);
        }
        
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 28px;
          border-radius: 999px;
          background: var(--gradient-primary);
          color: #ffffff;
          font-weight: 600;
          font-size: 15px;
          box-shadow: 0 4px 20px var(--brand-glow);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px var(--brand-glow);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 28px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--foreground);
          font-weight: 500;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-btn-secondary:hover {
          border-color: var(--brand);
          background: var(--brand-soft);
          color: var(--brand);
        }
        
        @media (max-width: 768px) {
          .hero-banner {
            min-height: 420px;
          }
          
          .hero-bg {
            background-size: cover !important;
            background-position: center center !important;
          }
        }
      `}} />
    </section>
  );
}
