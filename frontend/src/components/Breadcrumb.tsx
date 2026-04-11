import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={className}
      aria-label="面包屑导航"
      style={{
        marginBottom: 24,
        fontSize: 14,
        color: 'rgba(29, 20, 15, 0.6)',
      }}
    >
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 分隔符 */}
            {index > 0 && (
              <span style={{ opacity: 0.4 }}>/</span>
            )}
            
            {/* 链接或文本 */}
            {item.href ? (
              <Link
                href={item.href}
                style={{
                  color: 'rgba(29, 20, 15, 0.7)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(29, 20, 15, 0.7)')}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
