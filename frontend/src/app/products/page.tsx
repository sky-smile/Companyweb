import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ProductListClient } from './ProductListClient';

export const metadata: Metadata = buildMetadata({
  title: '产品中心',
  description: '查看企业产品目录、分类信息与详细参数说明。',
  path: '/products',
});

export default function ProductListPage() {
  return <ProductListClient />;
}
