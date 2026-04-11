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
        marginBottom: 28,
        fontSize: 14,
        color: 'rgba(232, 234, 240, 0.5)',
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
          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* 分隔符 */}
            {index > 0 && (
              <span style={{ opacity: 0.4, fontSize: 12 }}>›</span>
            )}

            {/* 链接或文本 */}
            {item.href ? (
              <Link
                href={item.href}
                style={{
                  color: 'rgba(232, 234, 240, 0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232, 234, 240, 0.65)')}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
