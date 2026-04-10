'use client';

import { useEffect } from 'react';
import { StatusCard } from '@/components/StatusCard';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <StatusCard
        title="页面暂时无法加载"
        description="公开网站数据服务当前不可用，可能是接口未启动或网络连接中断。请稍后重试，或先返回首页继续浏览。"
        primaryHref="/"
        primaryLabel="返回首页"
        secondaryHref="/contact"
        secondaryLabel="查看联系方式"
      />
      <section className="site-shell" style={{ paddingBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="status-button status-button-secondary" onClick={() => reset()}>
            重试加载
          </button>
        </div>
      </section>
    </div>
  );
}
