interface RichContentProps {
  content: string;
  className?: string;
  fallback?: string;
  style?: React.CSSProperties;
}

export function RichContent({ content, className, fallback = '内容待补充。', style }: RichContentProps) {
  if (!content || content.trim().length === 0) {
    return (
      <div className={className} style={{ lineHeight: 1.9, color: 'rgba(29, 20, 15, 0.7)', ...style }}>
        {fallback}
      </div>
    );
  }

  // 判断是否为 HTML 内容
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className={`rich-content ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ lineHeight: 1.9, ...style }}
      />
    );
  }

  // 纯文本内容，保留换行
  return (
    <div
      className={className}
      style={{ lineHeight: 1.9, whiteSpace: 'pre-wrap', color: 'rgba(29, 20, 15, 0.7)', ...style }}
    >
      {content}
    </div>
  );
}
