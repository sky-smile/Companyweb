import { StatusCard } from '@/components/StatusCard';

export default function NotFound() {
  return (
    <StatusCard
      title="页面不存在"
      description="当前访问的内容可能已下线、未发布，或链接地址不正确。你可以返回首页，或继续查看公开产品与新闻。"
      primaryHref="/"
      primaryLabel="返回首页"
      secondaryHref="/products"
      secondaryLabel="查看产品"
    />
  );
}
