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
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36, display: 'grid', gap: 18 }}>
        <h1 className="section-title">{contact.page.title || '联系我们'}</h1>
        <p className="section-copy" style={{ margin: 0 }}>{contact.page.content || '请在后台维护公司地址、邮箱、电话与地图嵌入说明。'}</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {contact.settings.map((item) => (
            <div key={item.settingKey} style={{ paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
              <strong>{item.description || item.settingKey}</strong>
              <div className="section-copy">{item.settingValue}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
