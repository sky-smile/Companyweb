'use client';

import { useState, useEffect } from 'react';

interface RichContentProps {
  content: string;
  className?: string;
  fallback?: string;
  style?: React.CSSProperties;
}

const DOM_PURIFY_CONFIG = {
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
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'width', 'height',
    'colspan', 'rowspan',
    'class',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ADD_ATTR: ['target'],
  FORCE_BODY: true,
};

function ensureImgAlt(html: string): string {
  return html.replace(/(<img(?![^>]*?\s+alt=)[^>]*)>/gi, '$1 alt="">');
}

export function RichContent({ content, className, fallback = '内容待补充。', style }: RichContentProps) {
  const [sanitized, setSanitized] = useState<string | null>(null);

  useEffect(() => {
    if (!content || !/<[a-z][\s\S]*>/i.test(content)) return;
    import('dompurify').then((mod) => {
      const DOMPurify = mod.default;
      const clean = DOMPurify.sanitize(content, DOM_PURIFY_CONFIG) as string;
      setSanitized(ensureImgAlt(clean));
    });
  }, [content]);

  if (!content || content.trim().length === 0) {
    return (
      <div className={className} style={{ lineHeight: 1.9, color: 'rgba(29, 20, 15, 0.7)', ...style }}>
        {fallback}
      </div>
    );
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    // SSR 阶段先渲染原始内容，客户端 hydration 后替换为清理后的内容
    return (
      <div
        className={`rich-content ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: sanitized ?? content }}
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
