/**
 * HTML 内容清理工具
 * 在服务端对富文本内容进行清理，去除危险的 HTML 标签和不必要的行内样式
 * 使用 sanitize-html 库提供更安全的 XSS 防护
 */

import * as sanitizeHtml from 'sanitize-html';

/** 允许保留的 HTML 标签（白名单） */
const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i',
  'a', 'img',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
];

/** 允许保留的属性（白名单） */
const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
};

/** sanitize-html 配置 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRS,
  // 禁止所有 style 和 class
  disallowedTagsMode: 'discard',
  // 自定义过滤器：移除空 span/div
  exclusiveFilter(frame) {
    return (frame.tag === 'span' || frame.tag === 'div') && !frame.text.trim();
  },
  // 允许相对协议的 URL
  allowedSchemes: ['http', 'https', 'mailto'],
  // 允许 img 的 src 为相对路径
  allowProtocolRelative: true,
};

/**
 * 清理 HTML 内容
 * - 移除不在白名单中的标签（保留内部文本）
 * - 移除不在白名单中的属性
 * - 始终移除 style 和 class 属性
 * - 移除空的 span/div 标签
 * - 防护 XSS 攻击（script、iframe、事件处理器等）
 */
export function sanitizeHtmlContent(html: string): string {
  if (!html || typeof html !== 'string') return '';

  // 使用 sanitize-html 进行清理
  let result = sanitizeHtml(html, SANITIZE_OPTIONS);

  // 清理多余空行
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
