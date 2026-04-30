import type { Metadata } from 'next';

export const siteName = 'Sky Smile';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:4001';
const defaultDescription = '企业官网、产品展示、新闻公告与联系方式统一对外展示平台。';

interface MetadataInput {
  title: string;
  description?: string;
  path?: string;
}

export function buildMetadata({ title, description, path = '/' }: MetadataInput): Metadata {
  const resolvedDescription = description?.trim() || defaultDescription;
  const resolvedTitle = `${title} | ${siteName}`;
  const canonicalUrl = new URL(path, siteUrl).toString();

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName,
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}

export function pickDescription(...values: Array<string | null | undefined>): string {
  const firstValid = values.find((value) => typeof value === 'string' && value.trim().length > 0);
  if (!firstValid) return defaultDescription;

  // 如果内容是 HTML，去除标签提取纯文本
  const stripped = firstValid.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  // 截取前 160 字符作为 description
  return stripped.length > 160 ? stripped.slice(0, 157) + '...' : stripped || defaultDescription;
}
