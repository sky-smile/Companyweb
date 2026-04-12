interface RichContentProps {
  content: string;
  className?: string;
  fallback?: string;
  style?: React.CSSProperties;
}

/**
 * 安全过滤：移除 script 标签和危险事件属性，保留富媒体标签
 */
function sanitizeForDisplay(html: string): string {
  if (!html) return '';
  
  let result = html;
  
  // 移除 script 标签及其内容
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 移除所有事件处理器 (onclick, onerror, onload...)
  result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // 移除 javascript: 协议
  result = result.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  
  // 确保 img 标签有 alt 属性（SEO 和可访问性）
  result = result.replace(/(<img(?![^>]*?\s+alt=)[^>]*)>/gi, '$1 alt="">');
  
  return result;
}

export function RichContent({ content, className, fallback = '内容待补充。', style }: RichContentProps) {
  if (!content || content.trim().length === 0) {
    return (
      <div className={className} style={{ lineHeight: 1.9, color: 'rgba(29, 20, 15, 0.7)', ...style }}>
        {fallback}
      </div>
    );
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    const sanitized = sanitizeForDisplay(content);
    return (
      <div
        className={`rich-content ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
        style={{ lineHeight: 1.9, ...style }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ lineHeight: 1.9, whiteSpace: 'pre-wrap', color: 'rgba(29, 20, 15, 0.7)', ...style }}
    >
      {content}
    </div>
  );
}
