'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { formatPublicDate } from '@/lib/public-content';
import { publicService } from '@/services/public-service';
import { RichContent } from '@/components/RichContent';
import { ListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await publicService.getAnnouncementDetail(id);
        setItem(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('公告不存在或尚未发布。');
        } else {
          setError('加载失败，请稍后重试。');
        }
        console.error('Failed to fetch announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  if (loading) {
    return (
      <section className="site-shell" style={{ padding: '42px 0' }}>
        <div className="site-card" style={{ padding: 36 }}>
          <ListSkeleton count={1} />
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="site-shell" style={{ padding: '42px 0' }}>
        <EmptyState
          title={error || '加载失败'}
          description="当前公告可能已下线或尚未发布。"
          actionHref="/"
          actionLabel="返回首页"
        />
      </section>
    );
  }

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <article className="site-card" style={{ padding: 36 }}>
        {/* 置顶标记和日期 */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13, color: 'var(--brand)', flexWrap: 'wrap', alignItems: 'center' }}>
          {item.isTop && <span style={{ background: 'var(--brand)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>置顶</span>}
          <span>{formatPublicDate(item.publishedAt)}</span>
        </div>

        {/* 标题 */}
        <h1 className="section-title" style={{ marginBottom: 20 }}>{item.title}</h1>

        {/* 摘要 */}
        {item.summary && (
          <p className="section-copy" style={{ marginTop: 0, marginBottom: 24, fontSize: 16, fontWeight: 500 }}>
            {item.summary}
          </p>
        )}

        {/* 富文本内容 */}
        <RichContent
          content={item.content}
          fallback="公告正文待补充。"
          style={{ marginTop: 24 }}
        />
      </article>
    </section>
  );
}
