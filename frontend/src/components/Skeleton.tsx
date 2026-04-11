interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  count = 1,
  variant = 'rectangular',
  className,
  style,
}: SkeletonProps) {
  if (variant === 'circular') {
    return (
      <div
        className={`${className} skeleton-shimmer`}
        style={{
          width: typeof width === 'number' ? width : width,
          height: typeof height === 'number' ? height : height,
          borderRadius: '50%',
          ...style,
        }}
      />
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${className} skeleton-shimmer`}
          style={{
            width: typeof width === 'number' ? width : width,
            height: typeof height === 'number' ? height : height,
            borderRadius,
            marginBottom: index < count - 1 ? 12 : 0,
            ...style,
          }}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div
      className="site-card"
      style={{
        padding: 24,
        background: 'var(--surface)',
      }}
    >
      <Skeleton height={16} width="30%" style={{ marginBottom: 16 }} />
      <Skeleton height={28} width="80%" style={{ marginBottom: 12 }} />
      <Skeleton count={2} height={16} width="100%" />
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            paddingBottom: 18,
            borderBottom: '1px solid var(--line)',
          }}
        >
          <Skeleton height={14} width="25%" style={{ marginBottom: 12 }} />
          <Skeleton height={24} width="70%" style={{ marginBottom: 10 }} />
          <Skeleton count={2} height={16} width="100%" />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6, columns = 'repeat(auto-fit, minmax(260px, 1fr))' }: { count?: number; columns?: string }) {
  return (
    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: columns }}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}
