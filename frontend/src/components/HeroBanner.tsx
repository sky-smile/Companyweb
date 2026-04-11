import Link from 'next/link';
import type { BannerItem } from '@/types/public';

interface HeroBannerProps {
  banners: BannerItem[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const banner = banners[0];

  return (
    <section className="site-shell" style={{ padding: '60px 0 32px' }}>
      <div 
        className="site-card" 
        style={{ 
          padding: '64px 48px', 
          minHeight: 480, 
          display: 'grid', 
          gap: 28,
          background: 'var(--gradient-hero)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '40%',
          height: '60%',
          background: 'radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        
        {/* 内容 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            color: 'var(--brand-light)', 
            letterSpacing: '0.2em', 
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
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
            background: 'linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {banner?.title || 'Reliable manufacturing, presented with clarity.'}
          </h1>
          
          <p style={{ 
            margin: '16px 0 0', 
            maxWidth: 640, 
            fontSize: 18,
            color: 'rgba(232, 234, 240, 0.7)',
            lineHeight: 1.7,
          }}>
            {banner?.subtitle || 'A modern company website that highlights product capability, company story, and the latest updates for global visitors.'}
          </p>
          
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
            <Link 
              href="/products" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 28px', 
                borderRadius: 999, 
                background: 'var(--gradient-primary)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 15,
                boxShadow: '0 4px 20px var(--brand-glow)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px var(--brand-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px var(--brand-glow)';
              }}
            >
              查看产品
              <span style={{ fontSize: 18 }}>→</span>
            </Link>
            <Link 
              href="/contact" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 28px', 
                borderRadius: 999, 
                border: '1px solid var(--line)',
                background: 'var(--surface-glass)',
                color: 'var(--foreground)',
                fontWeight: 500,
                fontSize: 15,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-light)';
                e.currentTarget.style.background = 'var(--brand-soft)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.background = 'var(--surface-glass)';
              }}
            >
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
