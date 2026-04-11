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
    <section className="site-shell" style={{ padding: '48px 0' }}>
      <div className="site-card" style={{ padding: 48, display: 'grid', gap: 24 }}>
        <h1 className="section-title">{contact.page.title || '联系我们'}</h1>
        <p className="section-copy" style={{ margin: 0, fontSize: 16 }}>{contact.page.content || '请在后台维护公司地址、邮箱、电话与地图嵌入说明。'}</p>
        <div style={{ display: 'grid', gap: 16 }}>
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
          padding-bottom: 16px;
          border-bottom: 1px solid var(--line);
          transition: border-color 0.2s ease;
        }
        
        .contact-item:hover {
          border-bottom-color: var(--brand-light);
        }
        
        .contact-item strong {
          font-size: 15px;
          font-weight: 600;
          color: var(--brand-light);
        }
        
        .contact-item .section-copy {
          margin-top: 6px;
          font-size: 15px;
        }
      `}} />
    </section>
  );
}
