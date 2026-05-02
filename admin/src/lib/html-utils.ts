/**
 * 清理 HTML — 保留必要的结构性属性（图片宽高、表格边框等）
 * 仅移除危险标签和样式，保留富媒体内容
 * 使用 DOMPurify 库提供浏览器兼容的 XSS 防护
 */

import DOMPurify from 'dompurify';

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
const ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'src', 'alt', 'width', 'height',
  'colspan', 'rowspan',
  'color', 'face', 'size',
  'style',
];

/**
 * 清理 HTML 内容
 * - 移除不在白名单中的标签（保留内部文本）
 * - 移除不在白名单中的属性
 * - 保留必要的行内样式（颜色、字体等）
 * - 防护 XSS 攻击（script、iframe、事件处理器等）
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  // 配置 DOMPurify
  const config: DOMPurify.Config = {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // 允许 style 属性
    ALLOW_DATA_ATTR: false,
  };

  // 使用 DOMPurify 进行清理
  let result = DOMPurify.sanitize(html, config) as string;

  // 清理多余空行
  result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  return result.trim();
}
