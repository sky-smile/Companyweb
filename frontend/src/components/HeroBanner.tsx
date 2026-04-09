import type { BannerItem } from '@/types/public';

interface HeroBannerProps {
  banners: BannerItem[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const banner = banners[0];

  return (
    <section className="site-shell" style={{ padding: '42px 0 24px' }}>
      <div className="site-card" style={{ padding: '48px 42px', minHeight: 420, display: 'grid', gap: 22, background: 'linear-gradient(145deg, rgba(255,248,241,0.96), rgba(239,223,204,0.92))' }}>
        <div style={{ color: 'var(--brand)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 12 }}>Industrial Brand Story</div>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.6rem, 5vw, 5rem)', lineHeight: 0.95 }}>
          {banner?.title || 'Reliable manufacturing, presented with clarity.'}
        </h1>
        <p className="section-copy" style={{ margin: 0, maxWidth: 620, fontSize: 18 }}>
          {banner?.subtitle || 'A modern company website that highlights product capability, company story, and the latest updates for global visitors.'}
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="/products" style={{ padding: '14px 22px', borderRadius: 999, background: 'var(--brand)', color: '#fff7f0' }}>查看产品</a>
          <a href="/contact" style={{ padding: '14px 22px', borderRadius: 999, border: '1px solid var(--line)' }}>联系我们</a>
        </div>
      </div>
    </section>
  );
}
