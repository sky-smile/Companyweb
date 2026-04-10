import { StatusCard } from '@/components/StatusCard';

export default function Loading() {
  return (
    <StatusCard
      title="页面加载中"
      description="正在读取最新的公开站点内容，请稍候。"
      primaryHref="/"
      primaryLabel="返回首页"
    />
  );
}
