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
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href || item.label} className="breadcrumb-item">
              {/* 分隔符 */}
              {index > 0 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  /
                </span>
              )}

              {/* 链接或文本 */}
              {isLast ? (
                // 最后一项：当前页面，不可点击
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                // 可点击的链接
                <Link href={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                // 无链接的中间层级
                <span className="breadcrumb-text">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* 样式 */}
      <style jsx>{`
        .breadcrumb {
          margin-bottom: 24px;
        }

        .breadcrumb-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 14px;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-separator {
          color: var(--text-muted);
          font-size: 12px;
          user-select: none;
        }

        .breadcrumb-link {
          color: var(--brand);
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .breadcrumb-link:hover {
          color: var(--brand-light);
        }

        .breadcrumb-text {
          color: var(--text-muted);
          white-space: nowrap;
        }

        .breadcrumb-current {
          color: var(--text);
          font-weight: 500;
          white-space: nowrap;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .breadcrumb {
            margin-bottom: 20px;
          }

          .breadcrumb-list {
            font-size: 13px;
            gap: 6px;
          }

          .breadcrumb-item {
            gap: 6px;
          }

          .breadcrumb-separator {
            font-size: 11px;
          }

          .breadcrumb-current {
            max-width: 150px;
            font-weight: 600;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb-list {
            font-size: 12px;
          }

          .breadcrumb-current {
            max-width: 120px;
            font-size: 12px;
          }

          .breadcrumb-link {
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>
    </nav>
  );
}
