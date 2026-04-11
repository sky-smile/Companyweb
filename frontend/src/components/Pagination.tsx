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
        gap: 8,
        marginTop: 32,
        flexWrap: 'wrap',
      }}
    >
      {/* 上一页 */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
          fontSize: 14,
          color: 'var(--foreground)',
        }}
      >
        上一页
      </button>

      {/* 页码 */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {getPageNumbers().map((page, index) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${index}`} style={{ padding: '0 4px', color: 'var(--foreground)', opacity: 0.5 }}>
              {page}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                minWidth: 36,
                height: 36,
                borderRadius: 8,
                border: '1px solid var(--line)',
                background: page === currentPage ? 'var(--brand)' : 'var(--surface)',
                color: page === currentPage ? '#fff' : 'var(--foreground)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: page === currentPage ? 600 : 400,
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
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
          fontSize: 14,
          color: 'var(--foreground)',
        }}
      >
        下一页
      </button>

      {/* 总页数信息 */}
      <span style={{ marginLeft: 16, fontSize: 14, color: 'rgba(29, 20, 15, 0.6)' }}>
        共 {total} 条，第 {currentPage}/{totalPages} 页
      </span>
    </div>
  );
}
