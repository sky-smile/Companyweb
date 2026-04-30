import { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Space, Button, Tooltip, Popover, Input, Dropdown } from 'antd';
import { App } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  UndoOutlined,
  RedoOutlined,
  PaperClipOutlined,
  ClearOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { uploadService } from '../../services/upload-service';
import { getErrorMessage } from '../../lib/error-utils';
import { sanitizeHtml } from '../../lib/html-utils';

// ─── Props 接口（与旧 RichTextEditor 完全一致） ─────────────────────────

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
  folder?: string;
}

// ─── 工具栏按钮样式 ────────────────────────────────────────────────────

const toolbarBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  borderRadius: 4,
  color: 'var(--ant-color-text)',
  fontSize: 14,
  padding: 0,
};

const activeBtnStyle: React.CSSProperties = {
  ...toolbarBtnStyle,
  background: 'var(--ant-color-primary-bg)',
  color: 'var(--ant-color-primary)',
};

const separatorStyle: React.CSSProperties = {
  display: 'inline-block',
  width: 1,
  height: 20,
  margin: '6px 4px',
  background: 'var(--ant-color-border-secondary)',
  verticalAlign: 'middle',
};

// ─── 主组件 ─────────────────────────────────────────────────────────────

export function RichTextEditor({
  value = '',
  onChange,
  height = 500,
  placeholder = '请输入内容...',
  disabled = false,
  folder = 'content',
}: RichTextEditorProps) {
  const uploadingFileRef = useRef(false);
  const isUpdatingFromPropRef = useRef(false);
  const message = App.useApp().message;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        // 排除可能重复的扩展，由单独导入的版本提供
        link: false,
        underline: false,
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { style: 'max-width: 100%; height: auto;' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      if (isUpdatingFromPropRef.current) return;
      const raw = ed.getHTML();
      const cleaned = sanitizeHtml(raw);
      onChange?.(cleaned);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
          if (imageFiles.length > 0) {
            event.preventDefault();
            imageFiles.forEach((file) => handleImageUpload(file));
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const files = event.clipboardData?.files;
        if (files && files.length > 0) {
          const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
          if (imageFiles.length > 0) {
            event.preventDefault();
            imageFiles.forEach((file) => handleImageUpload(file));
            return true;
          }
        }
        return false;
      },
    },
  });

  // 外部 value 变化时同步编辑器内容
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const currentHTML = sanitizeHtml(editor.getHTML());
    const incomingHTML = sanitizeHtml(value);
    if (currentHTML !== incomingHTML) {
      isUpdatingFromPropRef.current = true;
      editor.commands.setContent(value || '', { emitUpdate: false });
      isUpdatingFromPropRef.current = false;
    }
  }, [value, editor]);

  // disabled 变化时切换可编辑状态
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // 图片上传
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (disabled || !editor || editor.isDestroyed) return;
      try {
        const result = await uploadService.uploadImage(file, folder);
        editor.chain().focus().setImage({ src: result.publicUrl, alt: file.name }).run();
        message.success('图片上传成功');
      } catch (error) {
        message.error(getErrorMessage(error, '图片上传失败'));
      }
    },
    [editor, disabled, folder],
  );

  // 选择图片文件
  const handleSelectImage = useCallback(() => {
    if (disabled || !editor || editor.isDestroyed) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
  }, [editor, disabled, handleImageUpload]);

  // 插入附件
  const handleInsertAttachment = useCallback(async () => {
    if (disabled || !editor || editor.isDestroyed || uploadingFileRef.current) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      uploadingFileRef.current = true;
      try {
        const result = await uploadService.uploadFile(file, `${folder}-files`);
        const fileName = file.name;
        editor
          .chain()
          .focus()
          .insertContent(
            `<p><a href="${result.publicUrl}" target="_blank" download="${fileName}" ` +
              `style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;` +
              `background:#f0f5ff;border:1px solid #d4e3fc;border-radius:6px;color:#1677ff;text-decoration:none;">` +
              `<span>📎</span>${fileName}</a></p>`,
          )
          .run();
        message.success(`附件 "${fileName}" 已插入`);
      } catch (error) {
        message.error(getErrorMessage(error, '附件上传失败'));
      } finally {
        uploadingFileRef.current = false;
      }
    };
    input.click();
  }, [editor, disabled, folder]);

  // 插入链接
  const handleInsertLink = useCallback(() => {
    if (disabled || !editor || editor.isDestroyed) return;
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('请输入链接地址', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank' })
      .run();
  }, [editor, disabled]);

  // 插入表格
  const handleInsertTable = useCallback(() => {
    if (disabled || !editor || editor.isDestroyed) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor, disabled]);

  // 字数统计
  const characterCount = editor?.storage.characterCount;

  if (!editor) return null;

  // ─── 工具栏 ────────────────────────────────────────────────────────────

  const ToolbarButton = ({
    active,
    onClick,
    icon,
    title,
  }: {
    active?: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      style={active ? activeBtnStyle : toolbarBtnStyle}
      onClick={onClick}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      {icon}
    </button>
  );

  return (
    <div
      style={{
        border: '1px solid var(--ant-color-border)',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 工具栏 */}
      {!disabled && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            padding: '4px 8px',
            borderBottom: '1px solid var(--ant-color-border)',
            background: 'var(--ant-color-bg-container)',
          }}
        >
          {/* 撤销/重做 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={<UndoOutlined />}
            title="撤销"
            active={editor.can().undo()}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={<RedoOutlined />}
            title="重做"
            active={editor.can().redo()}
          />

          <span style={separatorStyle} />

          {/* 标题 */}
          <Dropdown
            menu={{
              items: [
                { key: '1', label: '标题 1' },
                { key: '2', label: '标题 2' },
                { key: '3', label: '标题 3' },
                { key: '4', label: '标题 4' },
                { key: 'p', label: '正文' },
              ],
              onClick: ({ key }) => {
                if (key === 'p') {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: Number(key) as 1 | 2 | 3 | 4 }).run();
                }
              },
            }}
          >
            <button type="button" style={toolbarBtnStyle} title="标题">
              H
            </button>
          </Dropdown>

          <span style={separatorStyle} />

          {/* 格式 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={<BoldOutlined />}
            title="粗体"
            active={editor.isActive('bold')}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<ItalicOutlined />}
            title="斜体"
            active={editor.isActive('italic')}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            icon={<UnderlineOutlined />}
            title="下划线"
            active={editor.isActive('underline')}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            icon={<StrikethroughOutlined />}
            title="删除线"
            active={editor.isActive('strike')}
          />

          <span style={separatorStyle} />

          {/* 对齐 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            icon={<AlignLeftOutlined />}
            title="左对齐"
            active={editor.isActive({ textAlign: 'left' })}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            icon={<AlignCenterOutlined />}
            title="居中"
            active={editor.isActive({ textAlign: 'center' })}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            icon={<AlignRightOutlined />}
            title="右对齐"
            active={editor.isActive({ textAlign: 'right' })}
          />

          <span style={separatorStyle} />

          {/* 列表 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<UnorderedListOutlined />}
            title="无序列表"
            active={editor.isActive('bulletList')}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<OrderedListOutlined />}
            title="有序列表"
            active={editor.isActive('orderedList')}
          />

          <span style={separatorStyle} />

          {/* 插入 */}
          <ToolbarButton onClick={handleInsertLink} icon={<LinkOutlined />} title="链接" active={editor.isActive('link')} />
          <ToolbarButton onClick={handleSelectImage} icon={<PictureOutlined />} title="插入图片" />
          <ToolbarButton onClick={handleInsertTable} icon={<TableOutlined />} title="插入表格" />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={<MinusOutlined />}
            title="分隔线"
          />

          <span style={separatorStyle} />

          {/* 清除格式 */}
          <ToolbarButton
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            icon={<ClearOutlined />}
            title="清除格式"
          />
        </div>
      )}

      {/* 编辑区域 */}
      <div
        style={{
          height,
          overflowY: 'auto',
          background: disabled ? 'var(--ant-color-bg-layout)' : '#fff',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* 底部工具栏 */}
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
            <Button size="small" icon={<PaperClipOutlined />} onClick={handleInsertAttachment} disabled={disabled}>
              插入附件
            </Button>
          </Tooltip>
          <span style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>
            支持拖拽/粘贴图片到编辑区域直接上传
          </span>
        </Space>
        <span style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 12 }}>
          {characterCount?.characters() ? `${characterCount.characters()} 字` : ''}
        </span>
      </div>

      {/* Tiptap 样式 */}
      <style>{`
        .tiptap-editor-content {
          padding: 12px 16px;
          min-height: 100%;
          outline: none;
          font-size: 14px;
          line-height: 1.7;
          color: var(--ant-color-text);
        }

        .tiptap-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--ant-color-text-quaternary);
          pointer-events: none;
          height: 0;
        }

        .tiptap-editor-content h1 { font-size: 28px; font-weight: 700; margin: 16px 0 8px; }
        .tiptap-editor-content h2 { font-size: 24px; font-weight: 700; margin: 14px 0 8px; }
        .tiptap-editor-content h3 { font-size: 20px; font-weight: 600; margin: 12px 0 6px; }
        .tiptap-editor-content h4 { font-size: 16px; font-weight: 600; margin: 10px 0 6px; }
        .tiptap-editor-content p { margin: 4px 0; }
        .tiptap-editor-content ul, .tiptap-editor-content ol { padding-left: 24px; margin: 4px 0; }
        .tiptap-editor-content li { margin: 2px 0; }
        .tiptap-editor-content blockquote {
          border-left: 3px solid var(--ant-color-border);
          padding-left: 12px;
          margin: 8px 0;
          color: var(--ant-color-text-secondary);
        }
        .tiptap-editor-content hr {
          border: none;
          border-top: 1px solid var(--ant-color-border);
          margin: 12px 0;
        }
        .tiptap-editor-content a {
          color: var(--ant-color-primary);
          text-decoration: underline;
        }
        .tiptap-editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 8px 0;
        }
        .tiptap-editor-content img.ProseMirror-selectednode {
          outline: 2px solid var(--ant-color-primary);
          border-radius: 4px;
        }

        /* 表格 */
        .tiptap-editor-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 8px 0;
          overflow: hidden;
        }
        .tiptap-editor-content td, .tiptap-editor-content th {
          border: 1px solid var(--ant-color-border);
          padding: 6px 10px;
          min-width: 60px;
          vertical-align: top;
          position: relative;
        }
        .tiptap-editor-content th {
          background: var(--ant-color-fill-quaternary);
          font-weight: 600;
        }
        .tiptap-editor-content .selectedCell {
          background: var(--ant-color-primary-bg);
        }
        .tiptap-editor-content .tableWrapper {
          overflow-x: auto;
          margin: 8px 0;
        }
        .tiptap-editor-content .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: var(--ant-color-primary-bg-hover);
          pointer-events: none;
        }

        /* 代码 */
        .tiptap-editor-content code {
          background: var(--ant-color-fill-quaternary);
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 90%;
        }
        .tiptap-editor-content pre {
          background: var(--ant-color-fill-quaternary);
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
        }
        .tiptap-editor-content pre code {
          background: none;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
