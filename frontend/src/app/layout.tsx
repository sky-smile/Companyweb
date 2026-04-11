import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { BackToTop } from '@/components/BackToTop';
import { buildMetadata } from '@/lib/seo';
import { OrganizationJsonLd } from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: '企业官网',
  description: '企业官网、产品展示、新闻公告与联系方式统一对外展示平台。',
  path: '/',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <BackToTop />
        
        {/* Organization JSON-LD */}
        <OrganizationJsonLd
          name="Sky Smile"
          url="http://127.0.0.1:3001"
          description="企业官网、产品展示、新闻公告与联系方式统一对外展示平台。"
        />
      </body>
    </html>
  );
}
