/** 常见图片格式的 magic number 签名 */
const IMAGE_SIGNATURES: Array<{ bytes: number[]; label: string }> = [
  { bytes: [0xff, 0xd8, 0xff], label: 'jpeg' },
  { bytes: [0x89, 0x50, 0x4e, 0x47], label: 'png' },
  { bytes: [0x47, 0x49, 0x46, 0x38], label: 'gif' },
];

/** MIME 类型到 magic number 标签的映射 */
const MIME_TO_MAGIC_LABEL: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

/** 禁止上传的危险 MIME 类型（可嵌入脚本） */
const BLOCKED_MIME_PATTERNS = [
  /^image\/svg/,
  /^text\/html/,
  /^application\/xhtml/,
  /^application\/javascript/,
  /^text\/javascript/,
];

/** 允许的图片 MIME 类型 */
const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

/** 允许的普通文件 MIME 类型 */
const ALLOWED_FILE_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
];

/** 允许的普通文件扩展名 */
const ALLOWED_FILE_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.txt', '.csv', '.zip', '.rar', '.7z',
];

/**
 * 检测图片 buffer 的实际格式，返回格式标签或 null
 */
export function detectImageFormat(buffer: Buffer): string | null {
  for (const sig of IMAGE_SIGNATURES) {
    if (buffer.length < sig.bytes.length) continue;
    if (sig.bytes.every((byte, i) => buffer[i] === byte)) {
      if (sig.label === 'gif' && buffer.length >= 6) {
        const version = buffer.subarray(3, 6).toString();
        if (version !== '87a' && version !== '89a') continue;
      }
      return sig.label;
    }
  }
  return null;
}

/**
 * 通过 magic number 校验文件是否为真实的图片格式
 */
export function hasImageMagicBytes(buffer: Buffer): boolean {
  for (const sig of IMAGE_SIGNATURES) {
    if (buffer.length < sig.bytes.length) continue;
    if (sig.bytes.every((byte, i) => buffer[i] === byte)) {
      // WebP 额外校验：RIFF 容器需要确认 subtype 为 WEBP
      if (sig.label === 'gif' && buffer.length >= 6) {
        // GIF 必须为 GIF87a 或 GIF89a
        const version = buffer.subarray(3, 6).toString();
        if (version !== '87a' && version !== '89a') continue;
      }
      return true;
    }
  }
  return false;
}

/**
 * 检测文件是否为 WebP（RIFF....WEBP 容器格式）
 */
export function isWebP(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  return (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  );
}

/**
 * 检查 MIME 类型是否在阻止名单中（SVG、HTML 等）
 */
export function isBlockedMimeType(mimeType: string): boolean {
  return BLOCKED_MIME_PATTERNS.some((pattern) => pattern.test(mimeType));
}

/**
 * 校验图片文件：MIME 类型白名单 + magic number 检测
 * 返回错误消息字符串，通过则返回 null
 */
export function validateImageFile(mimeType: string, buffer: Buffer): string | null {
  if (isBlockedMimeType(mimeType)) {
    return `不允许的文件类型: ${mimeType}`;
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
    return `不支持的图片格式: ${mimeType}`;
  }

  // WebP 由 RIFF 容器校验，不通过通用 magic number 检查
  if (mimeType === 'image/webp') {
    if (!isWebP(buffer)) {
      return '文件内容不是有效的 WebP 图片';
    }
    return null;
  }

  const detected = detectImageFormat(buffer);
  const expectedLabel = MIME_TO_MAGIC_LABEL[mimeType];

  if (detected === null || detected !== expectedLabel) {
    return '文件内容与声明的图片类型不符';
  }

  return null;
}

/**
 * 校验普通文件：MIME 类型白名单 + 扩展名白名单
 * 返回错误消息字符串，通过则返回 null
 */
export function validateFileUpload(mimeType: string, extension: string): string | null {
  if (isBlockedMimeType(mimeType)) {
    return `不允许的文件类型: ${mimeType}`;
  }

  if (!ALLOWED_FILE_MIME_TYPES.includes(mimeType)) {
    return `不支持的文件类型: ${mimeType}`;
  }

  const ext = extension.toLowerCase();
  if (!ext.startsWith('.')) {
    return `无效的文件扩展名`;
  }

  if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
    return `不支持的文件扩展名: ${ext}`;
  }

  return null;
}
