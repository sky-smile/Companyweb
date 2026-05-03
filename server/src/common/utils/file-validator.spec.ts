import {
  hasImageMagicBytes,
  isWebP,
  isBlockedMimeType,
  validateImageFile,
  validateFileUpload,
} from './file-validator';

describe('file-validator', () => {
  describe('hasImageMagicBytes', () => {
    it('应识别 JPEG 文件', () => {
      // JPEG magic: FF D8 FF
      const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      expect(hasImageMagicBytes(buffer)).toBe(true);
    });

    it('应识别 PNG 文件', () => {
      // PNG magic: 89 50 4E 47
      const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
      expect(hasImageMagicBytes(buffer)).toBe(true);
    });

    it('应识别 GIF 文件', () => {
      // GIF89a magic: 47 49 46 38 39 61
      const buffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      expect(hasImageMagicBytes(buffer)).toBe(true);
    });

    it('应拒绝非图片文件', () => {
      // HTML 文件: 3C 21 44 4F 43 54 59 50 45
      const buffer = Buffer.from('<!DOCTYPE html>', 'utf8');
      expect(hasImageMagicBytes(buffer)).toBe(false);
    });

    it('应拒绝空 buffer', () => {
      expect(hasImageMagicBytes(Buffer.alloc(0))).toBe(false);
    });
  });

  describe('isWebP', () => {
    it('应识别有效的 WebP 文件', () => {
      // RIFF....WEBP
      const buffer = Buffer.alloc(12);
      buffer.write('RIFF', 0);
      buffer.write('WEBP', 8);
      expect(isWebP(buffer)).toBe(true);
    });

    it('应拒绝非 WebP 的 RIFF 文件', () => {
      const buffer = Buffer.alloc(12);
      buffer.write('RIFF', 0);
      buffer.write('AVI ', 8);
      expect(isWebP(buffer)).toBe(false);
    });

    it('应拒绝过短的 buffer', () => {
      expect(isWebP(Buffer.alloc(4))).toBe(false);
    });
  });

  describe('isBlockedMimeType', () => {
    it('应阻止 SVG 类型', () => {
      expect(isBlockedMimeType('image/svg+xml')).toBe(true);
      expect(isBlockedMimeType('image/svg')).toBe(true);
    });

    it('应阻止 HTML 类型', () => {
      expect(isBlockedMimeType('text/html')).toBe(true);
      expect(isBlockedMimeType('application/xhtml+xml')).toBe(true);
    });

    it('应阻止 JavaScript 类型', () => {
      expect(isBlockedMimeType('application/javascript')).toBe(true);
      expect(isBlockedMimeType('text/javascript')).toBe(true);
    });

    it('应允许普通图片类型', () => {
      expect(isBlockedMimeType('image/jpeg')).toBe(false);
      expect(isBlockedMimeType('image/png')).toBe(false);
    });

    it('应允许普通文件类型', () => {
      expect(isBlockedMimeType('application/pdf')).toBe(false);
      expect(isBlockedMimeType('text/plain')).toBe(false);
    });
  });

  describe('validateImageFile', () => {
    it('应通过有效的 JPEG 文件', () => {
      const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      expect(validateImageFile('image/jpeg', buffer)).toBeNull();
    });

    it('应通过有效的 PNG 文件', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
      expect(validateImageFile('image/png', buffer)).toBeNull();
    });

    it('应通过有效的 WebP 文件', () => {
      const buffer = Buffer.alloc(12);
      buffer.write('RIFF', 0);
      buffer.write('WEBP', 8);
      expect(validateImageFile('image/webp', buffer)).toBeNull();
    });

    it('应拒绝 MIME 与内容不匹配的图片', () => {
      const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]); // JPEG bytes
      expect(validateImageFile('image/png', buffer)).toBe('文件内容与声明的图片类型不符');
    });

    it('应拒绝 SVG 伪装为图片', () => {
      const buffer = Buffer.from('<svg></svg>');
      expect(validateImageFile('image/svg+xml', buffer)).toBe('不允许的文件类型: image/svg+xml');
    });

    it('应拒绝不支持的图片格式', () => {
      const buffer = Buffer.from([0xff, 0xd8, 0xff]);
      expect(validateImageFile('image/bmp', buffer)).toBe('不支持的图片格式: image/bmp');
    });

    it('应拒绝非图片内容的 WebP', () => {
      const buffer = Buffer.alloc(12);
      buffer.write('RIFF', 0);
      buffer.write('XXXX', 8);
      expect(validateImageFile('image/webp', buffer)).toBe('文件内容不是有效的 WebP 图片');
    });
  });

  describe('validateFileUpload', () => {
    it('应通过有效的 PDF 文件', () => {
      expect(validateFileUpload('application/pdf', '.pdf')).toBeNull();
    });

    it('应通过有效的 DOCX 文件', () => {
      expect(validateFileUpload('application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx')).toBeNull();
    });

    it('应拒绝不支持的 MIME 类型', () => {
      expect(validateFileUpload('application/x-msdownload', '.exe')).toBe('不支持的文件类型: application/x-msdownload');
    });

    it('应拒绝不支持的扩展名', () => {
      expect(validateFileUpload('application/zip', '.exe')).toBe('不支持的文件扩展名: .exe');
    });

    it('应拒绝缺失点的扩展名', () => {
      expect(validateFileUpload('text/plain', 'txt')).toBe('无效的文件扩展名');
    });

    it('应拒绝 HTML 文件', () => {
      expect(validateFileUpload('text/html', '.html')).toBe('不允许的文件类型: text/html');
    });
  });
});
