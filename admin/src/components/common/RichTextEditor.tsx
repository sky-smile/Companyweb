import { useEffect, useState, useMemo, useCallback } from 'react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { Space, Button, Tooltip } from 'antd';
import { App } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { uploadService } from '../../services/upload-service';
import { getErrorMessage } from '../../lib/error-utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
  folder?: string;
}

// 获取 API 基础 URL（从环境变量或默认值）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api';

/**
 * 清理 HTML — 保留必要的结构性属性（图片宽高、表格边框等）
 * 仅移除危险标签和样式，保留富媒体内容
 */
function sanitizeHtml(html: string): string {
  if (!html) return '';

  let result = html;

  // 1. 移除 script 标签及其内容
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. 移除事件处理器
  result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');

  // 3. 移除危险协议
  result = result.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');

  // 4. 移除仅包含字体颜色/背景色的 style 属性（保留布局相关样式）
  result = result.replace(
    /\s+style\s*=\s*"([^"]*(?:color|font-family|font-size|background-color|letter-spacing)[^"]*)"/gi,
    ''
  );

  // 5. 移除 <font> 标签（旧版 Word 粘贴残留）
  result = result.replace(/<font[^>]*>/gi, '');
  result = result.replace(/<\/font>/gi, '');

  // 6. 移除仅包含空白的 span 标签
  result = result.replace(/<span[^>]*>(\s*)<\/span>/gi, '$1');

  // 7. 移除空段落
  result = result.replace(/<(p|div|h[1-6])[^>]*>\s*<\/\1>/gi, '');

  // 8. 清理多余连续空行
  result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  // 9. 确保 img 标签有 alt 属性
  result = result.replace(/(<img(?![^>]*?\s+alt=)[^>]*)>/gi, '$1 alt="">');

  return result.trim();
}

export function RichTextEditor({
  value = '',
  onChange,
  height = 500,
  placeholder = '请输入内容...',
  disabled = false,
  folder = 'content',
}: RichTextEditorProps) {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const message = App.useApp().message;

  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 工具栏配置：保留图片、表格等功能
  const toolbarConfig = useMemo(() => ({
    excludeKeys: [
      'headerSelect',       // 标题选择（保留其他标题方式）
      'group-more-style',   // 更多风格（下划线、删除线等）
      'color',              // 文字颜色
      'bgColor',            // 背景颜色
      'fontSize',           // 字号
      'fontFamily',         // 字体
      'lineHeight',         // 行高
      'indent',             // 缩进
      'delIndent',          // 取消缩进
      'emotion',            // 表情
      'codeBlock',          // 代码块
      'fullScreen',         // 全屏（在 Modal 中不需要）
    ],
  }), []);

  // 编辑器核心配置
  const editorConfig = useMemo(() => ({
    readOnly: disabled,
    placeholder,

    // 粘贴时保留格式（保留图片、表格等结构）
    pasteFilterStyle: false,
    pasteIgnoreImg: false,

    // 图片上传配置 — 使用自有后端
    MENU_CONF: {
      uploadImage: {
        // 使用完整 URL，wangEditor 不会使用 axios 的 baseURL
        server: `${API_BASE_URL}/admin/upload/image?folder=${encodeURIComponent(folder)}`,
        fieldName: 'file',
        maxFileSize: 10 * 1024 * 1024,
        allowedFileTypes: ['image/*'],
        // 携带 cookie 和自定义 header
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        // 自定义响应解析 - wangEditor 要求使用 insertFn 插入图片
        customInsert(res: { code: number; data?: { url: string }; message?: string }, insertFn: (url: string, alt: string, href: string) => void) {
          // 后端返回 { code:0, data:{ url } }
          if (res.code === 0 && res.data?.url) {
            insertFn(res.data.url, '', res.data.url);
          } else {
            message.error(res.message || '图片上传失败');
          }
        },
        // 错误处理
        onError(file: File, err: Error, res: unknown) {
          const msg = getErrorMessage(err) || getErrorMessage(res);
          message.error(`上传失败: ${msg}`);
        },
        // 成功回调（可选）
        onSuccess(_file: File, _res: unknown) {
          // 上传成功，无需额外处理
        },
        // 超时设置
        timeout: 30 * 1000,
      },
      
      // 插入网络图片配置
      insertImage: {
        checkImage(src: string): boolean | string | undefined {
          if (src.startsWith('http://') || src.startsWith('https://') || 
              src.startsWith('data:image/') || src.startsWith('/') || 
              src.startsWith('./')) {
            return true;
          }
          return '图片地址格式不正确';
        },
        parseImageSrc(src: string): string {
          return src.trim();
        },
      },
    },
  }), [disabled, placeholder, folder]);

  const handleChange = (ed: IDomEditor) => {
    const raw = ed.getHtml();
    const cleaned = sanitizeHtml(raw);
    onChange?.(cleaned);
  };

  // 插入附件（文件上传后生成下载链接）
  const handleInsertAttachment = useCallback(async () => {
    if (!editor || uploadingFile) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar';

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingFile(true);
      try {
        const result = await uploadService.uploadFile(file, `${folder}-files`);
        const fileName = file.name;
        
        // 在光标位置插入一个下载链接
        editor.dangerouslyInsertHtml(
          `<p><a href="${result.publicUrl}" target="_blank" download="${fileName}" ` +
          `style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;` +
          `background:#f0f5ff;border:1px solid #d4e3fc;border-radius:6px;color:#1677ff;text-decoration:none;">` +
          `<span>📎</span>${fileName}</a></p>`
        );
        message.success(`附件 "${fileName}" 已插入`);
      } catch (error) {
        message.error(getErrorMessage(error, '附件上传失败'));
      } finally {
        setUploadingFile(false);
      }
    };

    input.click();
  }, [editor, uploadingFile, folder]);

  return (
    <div style={{ border: '1px solid var(--ant-color-border)', borderRadius: 8, overflow: 'hidden' }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid var(--ant-color-border)' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={handleChange}
        mode="default"
        style={{ height }}
      />
      
      {/* 底部工具栏：附件上传 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderTop: '1px solid var(--ant-color-border)',
          background: 'var(--ant-color-bg-container)',
          fontSize: 13,
        }}
      >
        <Space>
          <Tooltip title="插入附件（PDF、Word、Excel 等）">
            <Button
              size="small"
              icon={<PaperClipOutlined />}
              loading={uploadingFile}
              onClick={handleInsertAttachment}
              disabled={disabled}
            >
              插入附件
            </Button>
          </Tooltip>
          <span style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>
            支持拖拽图片到编辑区域直接上传
          </span>
        </Space>
        <span style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 12 }}>
          {value ? `${(new DOMParser().parseFromString(value, 'text/html').body.textContent || '').length} 字` : ''}
        </span>
      </div>
    </div>
  );
}
