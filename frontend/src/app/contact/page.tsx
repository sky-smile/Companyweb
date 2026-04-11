import type { Metadata } from 'next';
import { buildMetadata, pickDescription } from '@/lib/seo';
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
    <section className="site-shell animate-fade-in-up" style={{ padding: '56px 0' }}>
      <div className="site-card" style={{ padding: 56, display: 'grid', gap: 28 }}>
        <h1 className="section-title">{contact.page.title || '联系我们'}</h1>
        <p className="section-copy" style={{ margin: 0, fontSize: 17 }}>{contact.page.content || '请在后台维护公司地址、邮箱、电话与地图嵌入说明。'}</p>
        <div style={{ display: 'grid', gap: 18 }}>
          {contact.settings.map((item) => (
            <div key={item.settingKey} className="contact-item">
              <strong>{item.description || item.settingKey}</strong>
              <div className="section-copy">{item.settingValue}</div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-item {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--line);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .contact-item:hover {
          border-color: var(--brand);
          background: var(--brand-soft);
          transform: translateX(4px);
        }
        
        .contact-item strong {
          font-size: 15px;
          font-weight: 600;
          color: var(--brand);
          display: block;
          margin-bottom: 6px;
        }
        
        .contact-item .section-copy {
          margin: 0;
          font-size: 15px;
        }
      `}} />
    </section>
  );
}
