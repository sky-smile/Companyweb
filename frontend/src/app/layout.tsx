import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { BackToTop } from '@/components/BackToTop';
import { buildMetadata } from '@/lib/seo';
import { OrganizationJsonLd } from '@/components/JsonLd';

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
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
