import Link from 'next/link';
import type { BannerItem } from '@/types/public';

interface HeroBannerProps {
  banners: BannerItem[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const banner = banners[0];

  return (
    <section 
      className="hero-banner animate-fade-in"
      style={{
        position: 'relative',
        minHeight: 580,
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
      
      {/* 装饰性渐变球 */}
      <div 
        className="hero-decoration-1"
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div 
        className="hero-decoration-2"
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />
      
      {/* 渐变遮罩 */}
      <div 
        className="hero-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* 内容 */}
      <div className="site-shell" style={{ position: 'relative', zIndex: 1, padding: '80px 0' }}>
        <div style={{ maxWidth: 800 }}>
          <div 
            className="animate-fade-in-up delay-100"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--brand)',
              letterSpacing: '0.22em',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 18 }}>🚀</span>
            INDUSTRIAL BRAND STORY
          </div>

          <h1 
            className="animate-fade-in-up delay-200"
            style={{
              margin: 0,
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--foreground)',
            }}
          >
            {banner?.title || 'Reliable manufacturing, presented with clarity.'}
          </h1>

          <p 
            className="animate-fade-in-up delay-300"
            style={{
              margin: '24px 0 0',
              maxWidth: 640,
              fontSize: 19,
              color: 'rgba(26, 32, 44, 0.68)',
              lineHeight: 1.75,
            }}
          >
            {banner?.subtitle || 'A modern company website that highlights product capability, company story, and the latest updates for global visitors.'}
          </p>

          <div 
            className="animate-fade-in-up delay-400"
            style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 40 }}
          >
            <Link
              href="/products"
              className="hero-btn-primary"
            >
              查看产品
              <span style={{ fontSize: 18, transition: 'transform 0.3s ease' }}>→</span>
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
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%);
        }
        
        .hero-overlay {
          backdrop-filter: blur(10px);
        }
        
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 32px;
          border-radius: 999px;
          background: var(--gradient-primary);
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 20px var(--brand-glow);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .hero-btn-primary::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .hero-btn-primary:hover::before {
          width: 300px;
          height: 300px;
        }

        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px var(--brand-glow);
        }
        
        .hero-btn-primary:hover span {
          transform: translateX(4px);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 18px 32px;
          border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--surface);
          color: var(--foreground);
          font-weight: 500;
          font-size: 16px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-btn-secondary:hover {
          border-color: var(--brand);
          background: var(--brand-soft);
          color: var(--brand);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .hero-banner {
            min-height: 480px;
          }
          
          .hero-bg {
            background-size: cover !important;
            background-position: center center !important;
          }
          
          .hero-decoration-1,
          .hero-decoration-2 {
            display: none;
          }
        }
      `}} />
    </section>
  );
}
