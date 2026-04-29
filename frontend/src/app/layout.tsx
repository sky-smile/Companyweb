import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { buildMetadata } from '@/lib/seo';
import { OrganizationJsonLd } from '@/components/JsonLd';
import { publicService } from '@/services/public-service';

const BackToTop = dynamic(() => import('@/components/BackToTop').then((mod) => ({ default: mod.BackToTop })), {
  ssr: false,
});

// 加载 Inter 字体
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: '企业官网',
  description: '企业官网、产品展示、新闻公告与联系方式统一对外展示平台。',
  path: '/',
});

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // 获取站点设置
  let siteName = '';
  let siteLogo = '';
  let contactPhone = '';
  let contactEmail = '';
  let contactAddress = '';
  let copyrightText = '';
  try {
    const settings = await publicService.getHome();
    siteName = settings.settings.find(s => s.settingKey === 'siteName')?.settingValue || '';
    siteLogo = settings.settings.find(s => s.settingKey === 'siteLogo')?.settingValue || '';
    contactPhone = settings.settings.find(s => s.settingKey === 'contactPhone')?.settingValue || '';
    contactEmail = settings.settings.find(s => s.settingKey === 'contactEmail')?.settingValue || '';
    contactAddress = settings.settings.find(s => s.settingKey === 'contactAddress')?.settingValue || '';
    copyrightText = settings.settings.find(s => s.settingKey === 'copyrightText')?.settingValue || '';
  } catch (error) {
    console.error('Failed to load site settings:', error);
  }

  return (
    <html lang="zh-CN" className={inter.variable}>
      <body style={{ margin: 0, padding: 0 }}>
        <SiteHeader />
        <main style={{ margin: 0, padding: 0 }}>{children}</main>
        <SiteFooter
          siteName={siteName}
          siteLogo={siteLogo}
          contactPhone={contactPhone}
          contactEmail={contactEmail}
          contactAddress={contactAddress}
          copyrightText={copyrightText}
        />
        <BackToTop />

        {/* Organization JSON-LD */}
        <OrganizationJsonLd
          name={siteName || 'Sky Smile'}
          url="http://127.0.0.1:3001"
          description="企业官网、产品展示、新闻公告与联系方式统一对外展示平台。"
        />
      </body>
    </html>
  );
}
