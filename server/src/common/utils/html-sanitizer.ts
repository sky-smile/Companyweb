/**
 * HTML 内容清理工具
 * 在服务端对富文本内容进行清理，去除危险的 HTML 标签和不必要的行内样式
 */

/** 允许保留的 HTML 标签（白名单） */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i',
  'a', 'img',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
]);

/** 允许保留的属性（白名单） */
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan']),
};

/**
 * 清理 HTML 内容
 * - 移除不在白名单中的标签（保留内部文本）
 * - 移除不在白名单中的属性
 * - 始终移除 style 和 class 属性
 * - 移除空的 span/div 标签
 */
export function sanitizeHtmlContent(html: string): string {
  if (!html || typeof html !== 'string') return '';

  let result = html;

  // 1. 移除所有 style 属性
  result = result.replace(/\s+style\s*=\s*["'][^"']*["']/gi, '');

  // 2. 移除所有 class 属性
  result = result.replace(/\s+class\s*=\s*["'][^"']*["']/gi, '');

  // 3. 移除 <font> 标签
  result = result.replace(/<font[^>]*>/gi, '');
  result = result.replace(/<\/font>/gi, '');

  // 4. 移除 <span> 标签（保留内部内容）- span 通常只带样式
  result = result.replace(/<span[^>]*>/gi, '');
  result = result.replace(/<\/span>/gi, '');

  // 5. 移除 script 和 iframe 等危险标签及内容
  result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  result = result.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
  result = result.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '');
  result = result.replace(/<embed[^>]*>/gi, '');
  result = result.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');
  result = result.replace(/<input[^>]*>/gi, '');
  result = result.replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '');
  result = result.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');

  // 6. 移除事件处理属性
  result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');

  // 7. 移除 javascript: 链接
  result = result.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');

  // 8. 清理非白名单标签（保留内部文本）
  result = result.replace(/<(\/?)(\w+)([^>]*)>/gi, (match, isClosing, tagName, attrs) => {
    const tag = tagName.toLowerCase();
    if (ALLOWED_TAGS.has(tag)) {
      // 对于允许的标签，过滤属性
      if (isClosing) return `</${tag}>`;

      const allowedAttrSet = ALLOWED_ATTRS[tag];
      if (!allowedAttrSet || allowedAttrSet.size === 0) {
        return `<${tag}>`;
      }

      // 保留白名单中的属性
      const attrMatches = attrs.match(/[\w-]+\s*=\s*["'][^"']*["']/g) || [];
      const filteredAttrs = attrMatches.filter((attr: string) => {
        const attrName = attr.split('=')[0].trim().toLowerCase();
        return allowedAttrSet.has(attrName);
      });

      return filteredAttrs.length > 0
        ? `<${tag} ${filteredAttrs.join(' ')}>`
        : `<${tag}>`;
    }
    // 非白名单标签：开标签移除，闭标签也移除
    return '';
  });

  // 9. 移除空 div
  result = result.replace(/<div[^>]*>\s*<\/div>/gi, '');

  // 10. 清理多余空行
  result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  return result.trim();
}

/**
 * 从 HTML 中提取纯文本（用于 SEO description 等场景）
 */
export function stripHtmlTags(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
