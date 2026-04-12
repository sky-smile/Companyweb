import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * 面包屑导航组件
 * - 支持任意数量的层级
 * - 最后一项默认为当前页面（不可点击）
 * - 响应式：移动端自动缩小字号
 */
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`breadcrumb ${className}`} aria-label="面包屑导航">
      <ol style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        fontSize: 14,
      }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href || item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {/* 分隔符 */}
              {index > 0 && (
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: 12,
                  userSelect: 'none',
                }} aria-hidden="true">
                  /
                </span>
              )}

              {/* 链接或文本 */}
              {isLast ? (
                // 最后一项：当前页面，不可点击
                <span style={{
                  color: 'var(--text)',
                  fontWeight: 500,
                }} aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                // 可点击的链接
                <Link
                  href={item.href}
                  style={{
                    color: 'var(--brand)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = 'var(--brand-light)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = 'var(--brand)';
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                // 无链接的中间层级
                <span style={{
                  color: 'var(--text-muted)',
                }}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* 响应式样式 */}
      <style jsx>{`
        .breadcrumb {
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .breadcrumb {
            margin-bottom: 20px;
          }

          .breadcrumb ol {
            font-size: 13px !important;
          }

          .breadcrumb span[aria-hidden="true"] {
            font-size: 11px !important;
          }
        }
      `}</style>
    </nav>
  );
}
