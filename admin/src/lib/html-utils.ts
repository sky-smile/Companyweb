/**
 * 清理 HTML — 保留必要的结构性属性（图片宽高、表格边框等）
 * 仅移除危险标签和样式，保留富媒体内容
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let result = html;

  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  result = result.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  result = result.replace(
    /\s+style\s*=\s*"([^"]*(?:color|font-family|font-size|background-color|letter-spacing)[^"]*)"/gi,
    '',
  );
  result = result.replace(/<font[^>]*>/gi, '');
  result = result.replace(/<\/font>/gi, '');
  result = result.replace(/<span[^>]*>(\s*)<\/span>/gi, '$1');
  result = result.replace(/<(p|div|h[1-6])[^>]*>\s*<\/\1>/gi, '');
  result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
  result = result.replace(/(<img(?![^>]*?\s+alt=)[^>]*)>/gi, '$1 alt="">');

  return result.trim();
}
