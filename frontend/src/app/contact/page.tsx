import type { Metadata } from 'next';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { RichContent } from '@/components/RichContent';
import { publicService } from '@/services/public-service';
import { ContactMap } from '@/components/ContactMap';

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

  // 过滤出核心联系信息
  const contactFields = [
    { key: 'siteName', label: '公司名称', icon: 'company' },
    { key: 'contactAddress', label: '公司地址', icon: 'location' },
    { key: 'contactEmail', label: '电子邮箱', icon: 'mail' },
    { key: 'contactPhone', label: '联系电话', icon: 'phone' },
  ];

  const filteredSettings = contactFields
    .map(field => {
      const setting = contact.settings.find(s => s.settingKey === field.key);
      return setting ? { ...setting, label: field.label, icon: field.icon } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // 获取地址用于地图
  const address = contact.settings.find(s => s.settingKey === 'contactAddress')?.settingValue || '';
  
  // 使用 Nominatim 地理编码服务将地址转换为经纬度
  let latitude = 0;
  let longitude = 0;
  
  if (address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'CompanyWeb/1.0',
          },
        }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        latitude = parseFloat(data[0].lat);
        longitude = parseFloat(data[0].lon);
      }
    } catch (error) {
      console.error('[Contact Page] Geocoding failed:', error);
    }
  }

  return (
    <>
      {/* 页面头部 Hero */}
      <section className="contact-hero">
        <div className="hero-background-decoration" />
        <div className="hero-secondary-decoration" />

        <div className="site-shell hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">Contact</div>
            <h1 className="hero-title">联系我们</h1>
            <p className="hero-description">
              如有任何问题或合作意向，欢迎通过以下方式与我们联系。
            </p>
          </div>
        </div>
      </section>

      {/* 联系信息和地图 */}
      <section className="site-shell contact-content">
        <div className="contact-layout">
          {/* 左侧联系信息列表 */}
          <div className="contact-info-side">
            <h2 className="contact-info-title">联系信息</h2>
            {filteredSettings.length > 0 ? (
              <ul className="contact-info-list">
                {filteredSettings.map((item) => (
                  <li key={item.settingKey} className="contact-info-item">
                    <div className="contact-info-icon">
                      {getContactIcon(item.icon)}
                    </div>
                    <div className="contact-info-text">
                      <div className="contact-info-label">{item.label}</div>
                      <div className="contact-info-value">
                        {item.settingKey === 'contactEmail' ? (
                          <a href={`mailto:${item.settingValue}`}>{item.settingValue}</a>
                        ) : item.settingKey === 'contactPhone' ? (
                          <a href={`tel:${item.settingValue}`}>{item.settingValue}</a>
                        ) : (
                          item.settingValue
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="contact-info-empty">暂无联系信息</div>
            )}
          </div>

          {/* 右侧地图 */}
          <div className="contact-map-side">
            <div className="contact-map-container">
              <ContactMap 
                address={address}
                latitude={latitude}
                longitude={longitude}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 样式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ========== 页面头部 Hero ========== */
        .contact-hero {
          position: relative;
          padding-top: var(--page-top, 108px);
          padding-bottom: 56px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 50%, #ffffff 100%);
          border-bottom: 1px solid var(--line);
        }

        .hero-background-decoration {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .hero-secondary-decoration {
          position: absolute;
          bottom: -15%;
          left: -5%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-text {
          max-width: 700px;
        }

        .hero-eyebrow {
          color: var(--brand);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.25rem, 5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }

        .hero-description {
          margin-top: 18px;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 600px;
        }

        .hero-description p {
          margin: 0;
        }

        /* ========== 联系信息区域 ========== */
        .contact-content {
          padding-top: 72px;
          padding-bottom: 72px;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        /* 左侧联系信息 */
        .contact-info-side {
          padding: 32px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--line);
          min-height: 400px;
        }

        .contact-info-title {
          margin: 0 0 32px 0;
          font-size: 24px;
          font-weight: 700;
          color: var(--foreground);
          letter-spacing: -0.02em;
        }

        .contact-info-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          border-radius: 12px;
          background: var(--brand-soft, rgba(37, 99, 235, 0.05));
          transition: all 0.3s ease;
        }

        .contact-info-item:hover {
          background: rgba(37, 99, 235, 0.1);
          transform: translateX(4px);
        }

        /* 图标 */
        .contact-info-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--brand);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .contact-info-icon svg {
          width: 22px;
          height: 22px;
        }

        /* 文本内容 */
        .contact-info-text {
          flex: 1;
          min-width: 0;
        }

        .contact-info-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--brand);
          margin-bottom: 8px;
          letter-spacing: 0.03em;
        }

        .contact-info-value {
          font-size: 16px;
          line-height: 1.6;
          color: var(--foreground);
          word-break: break-word;
        }

        .contact-info-value a {
          color: var(--brand);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-info-value a:hover {
          color: var(--brand-light);
          text-decoration: underline;
        }

        .contact-info-empty {
          text-align: center;
          padding: 48px 24px;
          color: var(--text-muted);
          font-size: 15px;
        }

        /* 右侧地图 */
        .contact-map-side {
          position: sticky;
          top: 100px;
        }

        .contact-map-container {
          width: 100%;
          height: 500px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: #f5f5f5;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .contact-map-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          color: var(--text-muted);
          font-size: 16px;
        }

        /* ========== 响应式适配 ========== */
        @media (max-width: 1024px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .contact-map-side {
            position: static;
          }

          .contact-map-container {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding-top: var(--page-top, 96px);
            padding-bottom: 48px;
          }

          .hero-background-decoration {
            width: 350px;
            height: 350px;
            top: -15%;
            right: -15%;
          }

          .hero-secondary-decoration {
            width: 300px;
            height: 300px;
            bottom: -10%;
            left: -10%;
          }

          .hero-title {
            font-size: clamp(1.75rem, 6vw, 2.25rem);
          }

          .hero-description {
            font-size: 15px;
            margin-top: 14px;
          }

          .contact-content {
            padding-top: 48px;
            padding-bottom: 48px;
          }

          .contact-info-side {
            padding: 24px;
            min-height: auto;
          }

          .contact-info-title {
            font-size: 20px;
            margin-bottom: 24px;
          }

          .contact-info-list {
            gap: 20px;
          }

          .contact-info-item {
            padding: 16px;
            gap: 12px;
          }

          .contact-info-icon {
            width: 40px;
            height: 40px;
          }

          .contact-info-icon svg {
            width: 20px;
            height: 20px;
          }

          .contact-info-label {
            font-size: 12px;
            margin-bottom: 6px;
          }

          .contact-info-value {
            font-size: 15px;
          }

          .contact-map-container {
            height: 350px;
          }
        }

        @media (max-width: 480px) {
          .hero-eyebrow {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .hero-description {
            font-size: 14px;
            line-height: 1.6;
          }

          .contact-info-side {
            padding: 20px;
          }

          .contact-info-item {
            padding: 14px;
          }

          .contact-info-icon {
            width: 36px;
            height: 36px;
          }

          .contact-info-icon svg {
            width: 18px;
            height: 18px;
          }

          .contact-info-value {
            font-size: 14px;
          }

          .contact-map-container {
            height: 280px;
          }
        }
      `}} />
    </>
  );
}

/**
 * 根据图标类型返回对应的 SVG 图标
 */
function getContactIcon(type: string) {
  const icons: Record<string, React.ReactNode> = {
    company: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  };

  return icons[type] || icons.company;
}
