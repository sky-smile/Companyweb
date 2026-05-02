import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './html-utils';

describe('html-utils', () => {
  describe('sanitizeHtml', () => {
    it('应该返回空字符串当输入为空', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null as unknown as string)).toBe('');
      expect(sanitizeHtml(undefined as unknown as string)).toBe('');
    });

    it('应该保留白名单标签', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHtml(html);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('应该移除 script 标签', () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('<p>Hello</p>');
    });

    it('应该移除 iframe 标签', () => {
      const html = '<p>Hello</p><iframe src="evil.com"></iframe>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('<iframe>');
      expect(result).toContain('<p>Hello</p>');
    });

    it('应该移除事件处理器', () => {
      const html = '<p onclick="alert(\'xss\')">Hello</p>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('onclick');
      expect(result).toContain('Hello');
    });

    it('应该移除 javascript: 链接', () => {
      const html = '<a href="javascript:alert(\'xss\')">Click</a>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('javascript:');
      expect(result).toContain('Click');
    });

    it('应该保留白名单属性', () => {
      const html = '<a href="https://example.com" target="_blank">Link</a>';
      const result = sanitizeHtml(html);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('target="_blank"');
    });

    it('应该保留 font 标签和属性', () => {
      const html = '<font color="red" size="3">Text</font>';
      const result = sanitizeHtml(html);
      expect(result).toContain('color="red"');
      expect(result).toContain('Text');
    });

    it('应该保留 img 标签的白名单属性', () => {
      const html = '<img src="test.jpg" alt="Test" width="100" height="100">';
      const result = sanitizeHtml(html);
      expect(result).toContain('src="test.jpg"');
      expect(result).toContain('alt="Test"');
      expect(result).toContain('width="100"');
      expect(result).toContain('height="100"');
    });

    it('应该保留表格标签和属性', () => {
      const html = '<table><thead><tr><th colspan="2">Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>';
      const result = sanitizeHtml(html);
      expect(result).toContain('<table>');
      expect(result).toContain('<thead>');
      expect(result).toContain('<tbody>');
      expect(result).toContain('colspan="2"');
    });
  });
});
