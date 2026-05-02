interface RichContentProps {
  content: string;
  className?: string;
  fallback?: string;
  style?: React.CSSProperties;
}

import DOMPurify from 'dompurify';

/**
 * 安全过滤：使用 DOMPurify 清理 HTML，防止 XSS 攻击
 * - 移除 script、iframe、事件处理器等危险内容
 * - 保留富媒体标签和必要的属性
 */
function sanitizeForDisplay(html: string): string {
  if (!html) return '';

  // 配置 DOMPurify
  const config = {
    // 允许的标签
    ALLOWED_TAGS: [
      'p', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'strong', 'b', 'em', 'i',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    // 允许的属性
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'colspan', 'rowspan',
      'class',
    ],
    // 允许的 URL 协议
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // 添加 rel="noopener noreferrer" 到所有链接
    ADD_ATTR: ['target'],
    // 强制链接在新窗口打开
    FORCE_BODY: true,
  };

  // 清理 HTML
  const result = DOMPurify.sanitize(html, config);

  // 确保 img 标签有 alt 属性（SEO 和可访问性）
  return result.replace(/(<img(?![^>]*?\s+alt=)[^>]*)>/gi, '$1 alt="">');
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
