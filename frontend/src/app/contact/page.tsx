import type { Metadata } from 'next';
import Link from 'next/link';
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
      <section style={{
        position: 'relative',
        padding: '80px 0 48px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div className="site-shell" style={{ position: 'relative', zIndex: 1 }}>
          {/* 面包屑 */}
          <nav style={{ fontSize: 14, color: 'rgba(15, 23, 42, 0.5)', marginBottom: 28 }}>
            <Link href="/" style={{ color: 'rgba(15, 23, 42, 0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>首页</Link>
            <span style={{ margin: '0 10px' }}>/</span>
            <span style={{ color: 'var(--brand)', fontWeight: 500 }}>联系我们</span>
          </nav>

          <div style={{ maxWidth: 700 }}>
            <div style={{
              color: 'var(--brand)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
            }}>
              Contact
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
            }}>
              {contact.page.title || '联系我们'}
            </h1>
            <RichContent
              content={contact.page.content}
              fallback="请在后台维护公司地址、邮箱、电话与地图嵌入说明。"
              style={{ marginTop: 16, maxWidth: 560 }}
            />
          </div>
        </div>
      </section>

      {/* 联系信息卡片 */}
      <section className="site-shell" style={{ padding: '48px 0' }}>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {contact.settings.map((item) => (
            <div key={item.settingKey} style={{
              padding: 28,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
              background: '#ffffff',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--brand)',
                marginBottom: 10,
                letterSpacing: '0.03em',
              }}>
                {item.description || item.settingKey}
              </div>
              <div className="section-copy" style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                {item.settingValue}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .site-shell div[style]:hover {
          border-color: var(--brand);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}} />
    </>
  );
}
