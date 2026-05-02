/**
 * 清理 HTML — 保留必要的结构性属性（图片宽高、表格边框等）
 * 仅移除危险标签和样式，保留富媒体内容
 * 使用 sanitize-html 库提供更安全的 XSS 防护
 */

import sanitizeHtml from 'sanitize-html';

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
  'font', // 保留 font 标签以兼容旧内容
];

/** 允许保留的属性（白名单） */
const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
  font: ['color', 'face', 'size'],
  span: ['style'], // 允许 span 的 style 用于富文本编辑器
  div: ['style'], // 允许 div 的 style 用于富文本编辑器
};

/** 允许的 CSS 属性（用于 style 属性） */
const ALLOWED_STYLES: Record<string, Array<string | RegExp>> = {
  '*': ['color', 'font-family', 'font-size', 'background-color', 'letter-spacing', 'text-align'],
};

/** sanitize-html 配置 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRS,
  allowedStyles: ALLOWED_STYLES,
  // 禁止所有 script 和 iframe
  disallowedTagsMode: 'discard',
  // 自定义过滤器：移除空标签
  exclusiveFilter(frame) {
    return (frame.tag === 'span' || frame.tag === 'div' || frame.tag === 'font') && !frame.text.trim();
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
 * - 保留必要的行内样式（颜色、字体等）
 * - 移除空的 span/div/font 标签
 * - 防护 XSS 攻击（script、iframe、事件处理器等）
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  // 使用 sanitize-html 进行清理
  let result = sanitizeHtml(html, SANITIZE_OPTIONS);

  // 清理多余空行
  result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  return result.trim();
}
