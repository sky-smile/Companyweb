import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = '暂无内容',
  description = '当前还没有任何内容，请稍后再查看。',
  actionHref,
  actionLabel,
  icon,
}: EmptyStateProps) {
  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        color: 'rgba(29, 20, 15, 0.5)',
      }}
    >
      {/* 图标 */}
      <div
        style={{
          fontSize: 64,
          marginBottom: 20,
          opacity: 0.3,
        }}
      >
        {icon || '📭'}
      </div>

      {/* 标题 */}
      <h3
        style={{
          margin: '0 0 12px',
          fontSize: 20,
          fontWeight: 600,
          color: 'rgba(29, 20, 15, 0.7)',
        }}
      >
        {title}
      </h3>

      {/* 描述 */}
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 15,
          lineHeight: 1.6,
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {description}
      </p>

      {/* 操作按钮 */}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 999,
            background: 'var(--brand)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--brand-deep)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--brand)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
