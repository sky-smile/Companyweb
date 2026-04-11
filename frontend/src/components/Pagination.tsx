'use client';

import { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  if (totalPages <= 1) return null;

  // 生成页码数组（最多显示 7 个页码）
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 40,
        flexWrap: 'wrap',
      }}
    >
      {/* 上一页 */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 18px',
          borderRadius: 10,
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.4 : 1,
          fontSize: 14,
          fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.borderColor = 'var(--brand-light)';
            e.currentTarget.style.background = 'var(--brand-soft)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.borderColor = 'var(--line)';
            e.currentTarget.style.background = 'var(--surface)';
          }
        }}
      >
        <span style={{ fontSize: 16 }}>‹</span>
        上一页
      </button>

      {/* 页码 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {getPageNumbers().map((page, index) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${index}`} style={{ padding: '0 6px', color: 'var(--foreground)', opacity: 0.4, fontWeight: 600 }}>
              {page}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                minWidth: 40,
                height: 40,
                borderRadius: 10,
                border: page === currentPage ? 'none' : '1px solid var(--line)',
                background: page === currentPage ? 'var(--gradient-primary)' : 'var(--surface)',
                color: page === currentPage ? '#fff' : 'var(--foreground)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: page === currentPage ? 700 : 500,
                boxShadow: page === currentPage ? '0 4px 16px var(--brand-glow)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (page !== currentPage) {
                  e.currentTarget.style.borderColor = 'var(--brand-light)';
                  e.currentTarget.style.background = 'var(--brand-soft)';
                }
              }}
              onMouseLeave={(e) => {
                if (page !== currentPage) {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.background = 'var(--surface)';
                }
              }}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* 下一页 */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 18px',
          borderRadius: 10,
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.4 : 1,
          fontSize: 14,
          fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.borderColor = 'var(--brand-light)';
            e.currentTarget.style.background = 'var(--brand-soft)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.borderColor = 'var(--line)';
            e.currentTarget.style.background = 'var(--surface)';
          }
        }}
      >
        下一页
        <span style={{ fontSize: 16 }}>›</span>
      </button>

      {/* 总页数信息 */}
      <span style={{ marginLeft: 20, fontSize: 14, color: 'rgba(232, 234, 240, 0.5)', fontWeight: 500 }}>
        共 {total} 条，第 {currentPage}/{totalPages} 页
      </span>
    </div>
  );
}
