import { sanitizeHtmlContent, stripHtmlTags } from './html-sanitizer';

describe('html-sanitizer', () => {
  describe('sanitizeHtmlContent', () => {
    it('应该返回空字符串当输入为空', () => {
      expect(sanitizeHtmlContent('')).toBe('');
      expect(sanitizeHtmlContent(null as unknown as string)).toBe('');
      expect(sanitizeHtmlContent(undefined as unknown as string)).toBe('');
    });

    it('应该保留白名单标签', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHtmlContent(html);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('应该移除 script 标签', () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizeHtmlContent(html);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('<p>Hello</p>');
    });

    it('应该移除 iframe 标签', () => {
      const html = '<p>Hello</p><iframe src="evil.com"></iframe>';
      const result = sanitizeHtmlContent(html);
      expect(result).not.toContain('<iframe>');
      expect(result).toContain('<p>Hello</p>');
    });

    it('应该移除事件处理器', () => {
      const html = '<p onclick="alert(\'xss\')">Hello</p>';
      const result = sanitizeHtmlContent(html);
      expect(result).not.toContain('onclick');
      expect(result).toContain('Hello');
    });

    it('应该移除 javascript: 链接', () => {
      const html = '<a href="javascript:alert(\'xss\')">Click</a>';
      const result = sanitizeHtmlContent(html);
      expect(result).not.toContain('javascript:');
      expect(result).toContain('Click');
    });

    it('应该保留白名单属性', () => {
      const html = '<a href="https://example.com" target="_blank">Link</a>';
      const result = sanitizeHtmlContent(html);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('target="_blank"');
    });

    it('应该移除非白名单属性', () => {
      const html = '<a href="https://example.com" data-custom="value">Link</a>';
      const result = sanitizeHtmlContent(html);
      expect(result).toContain('href="https://example.com"');
      expect(result).not.toContain('data-custom');
    });

    it('应该移除 style 和 class 属性', () => {
      const html = '<p style="color: red" class="my-class">Hello</p>';
      const result = sanitizeHtmlContent(html);
      expect(result).not.toContain('style');
      expect(result).not.toContain('class');
      expect(result).toContain('Hello');
    });

    it('应该保留 img 标签的白名单属性', () => {
      const html = '<img src="test.jpg" alt="Test" width="100" height="100">';
      const result = sanitizeHtmlContent(html);
      expect(result).toContain('src="test.jpg"');
      expect(result).toContain('alt="Test"');
      expect(result).toContain('width="100"');
      expect(result).toContain('height="100"');
    });

    it('应该保留表格标签和属性', () => {
      const html = '<table><thead><tr><th colspan="2">Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>';
      const result = sanitizeHtmlContent(html);
      expect(result).toContain('<table>');
      expect(result).toContain('<thead>');
      expect(result).toContain('<tbody>');
      expect(result).toContain('colspan="2"');
    });
  });

  describe('stripHtmlTags', () => {
    it('应该返回空字符串当输入为空', () => {
      expect(stripHtmlTags('')).toBe('');
      expect(stripHtmlTags(null as unknown as string)).toBe('');
      expect(stripHtmlTags(undefined as unknown as string)).toBe('');
    });

    it('应该移除所有 HTML 标签', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = stripHtmlTags(html);
      expect(result).toBe('Hello World');
    });

    it('应该转换 HTML 实体', () => {
      const html = '&amp; &lt; &gt; &quot; &nbsp;';
      const result = stripHtmlTags(html);
      expect(result).toBe('& < > "');
    });

    it('应该压缩多余空格', () => {
      const html = '<p>Hello   World</p>';
      const result = stripHtmlTags(html);
      expect(result).toBe('Hello World');
    });
  });
});
