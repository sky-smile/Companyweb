import type { Metadata } from 'next';

const siteName = 'Sky Smile';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3001';
const defaultDescription = '企业官网、产品展示、新闻公告与联系方式统一对外展示平台。';

interface MetadataInput {
  title: string;
  description?: string;
  path?: string;
}

export function buildMetadata({ title, description, path = '/' }: MetadataInput): Metadata {
  const resolvedDescription = description?.trim() || defaultDescription;
  const resolvedTitle = `${title} | ${siteName}`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: new URL(path, siteUrl).toString(),
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
  return firstValid?.trim() || defaultDescription;
}
