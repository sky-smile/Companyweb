import type { Metadata } from 'next';
import Link from 'next/link';
import { formatPublicDate } from '@/lib/public-content';
import { buildMetadata } from '@/lib/seo';
import { publicService } from '@/services/public-service';

export const metadata: Metadata = buildMetadata({
  title: '新闻中心',
  description: '查看企业最新新闻、动态更新与业务资讯。',
  path: '/news',
});

export default async function NewsListPage() {
  const news = await publicService.getNewsList();

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">新闻中心</h1>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {news.list.length === 0 ? <div className="section-copy">暂无已发布新闻。</div> : null}
          {news.list.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} style={{ paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
              <div style={{ color: 'var(--brand)', marginBottom: 8 }}>
                {item.categoryName || '新闻'} · {formatPublicDate(item.publishedAt)}
              </div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.title}</div>
              <div className="section-copy">{item.summary || '新闻摘要待补充。'}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
