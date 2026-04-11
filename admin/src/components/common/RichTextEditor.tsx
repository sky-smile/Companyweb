import { useEffect, useState, useMemo } from 'react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * 清理 wangEditor 输出的 HTML，去除不必要的行内样式和标签
 * - 移除所有 style 属性（颜色、字体、背景等 Word/网页粘贴残留）
 * - 移除 <span> 标签（仅保留内部文本）
 * - 移除空标签
 * - 保留语义标签：p, h1-h6, ul, ol, li, a, strong, b, em, i, blockquote, img, br, hr, pre, code, table, thead, tbody, tr, th, td
 */
function sanitizeHtml(html: string): string {
  if (!html) return '';

  // 1. 移除所有 style 属性
  let result = html.replace(/\s+style\s*=\s*["'][^"']*["']/gi, '');

  // 2. 移除 <span> 标签（保留内部内容）
  result = result.replace(/<span[^>]*>/gi, '');
  result = result.replace(/<\/span>/gi, '');

  // 3. 移除 <font> 标签（旧版 Word 粘贴残留）
  result = result.replace(/<font[^>]*>/gi, '');
  result = result.replace(/<\/font>/gi, '');

  // 4. 移除 class 属性（wangEditor 自身不依赖 class，外部粘贴可能带来）
  result = result.replace(/\s+class\s*=\s*["'][^"']*["']/gi, '');

  // 5. 移除空段落（仅含空白字符的 p/div/h 标签）
  result = result.replace(/<(p|div|h[1-6])[^>]*>\s*<\/\1>/gi, '');

  // 6. 清理多余空行（连续2个以上空行合并为1个）
  result = result.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  return result.trim();
}

export function RichTextEditor({
  value = '',
  onChange,
  height = 500,
  placeholder = '请输入内容...',
  disabled = false,
}: RichTextEditorProps) {
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 工具栏配置：精简按钮，去除颜色/字体/背景等易产生行内样式的功能
  const toolbarConfig = useMemo<IToolbarConfig>(() => ({
    excludeKeys: [
      'headerSelect',       // 标题选择（保留其他标题方式）
      'italic',             // 斜体（可选，按需注释）
      'group-more-style',   // 更多风格（下划线、删除线等）
      'color',              // 文字颜色
      'bgColor',            // 背景颜色
      'fontSize',           // 字号
      'fontFamily',         // 字体
      'lineHeight',         // 行高
      'indent',             // 缩进
      'delIndent',          // 取消缩进
      'emotion',            // 表情
      'insertLink',         // 插入链接（按需，可注释以允许）
      'editLink',           // 编辑链接
      'unLink',             // 取消链接
      'viewLink',           // 查看链接
      'codeBlock',          // 代码块
      'blockquote',         // 引用（按需）
      'divider',            // 分割线
    ],
  }), []);

  // 编辑器配置：粘贴时自动去除样式
  const editorConfig = useMemo<IEditorConfig>(() => ({
    readOnly: disabled,
    placeholder,
    // 粘贴时仅保留纯文本，去除所有格式
    pasteFilterStyle: true,
    // 忽略粘贴内容中的图片（防止外部图片链接失效）
    pasteIgnoreImg: false,
    // 自定义粘贴处理：将粘贴内容转为纯文本格式再插入
    customPaste: (ed: IDomEditor, event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') || '';
      if (text) {
        // 按换行分段插入
        const paragraphs = text.split(/\n\s*\n/);
        paragraphs.forEach((para, index) => {
          const trimmed = para.trim();
          if (trimmed) {
            ed.insertText(trimmed);
            if (index < paragraphs.length - 1) {
              ed.insertBreak();
            }
          }
        });
      }
      return false; // 返回 false 阻止默认粘贴行为
    },
  }), [disabled, placeholder]);

  const handleChange = (ed: IDomEditor) => {
    const raw = ed.getHtml();
    const cleaned = sanitizeHtml(raw);
    onChange?.(cleaned);
  };

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
    </div>
  );
}
