import { useEffect, useState } from 'react';
import { IDomEditor } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
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

  const handleChange = (ed: IDomEditor) => {
    onChange?.(ed.getHtml());
  };

  return (
    <div style={{ border: '1px solid var(--ant-color-border)', borderRadius: 8, overflow: 'hidden' }}>
      <Toolbar
        editor={editor}
        defaultConfig={{}}
        mode="default"
        style={{ borderBottom: '1px solid var(--ant-color-border)' }}
      />
      <Editor
        defaultConfig={{}}
        value={value}
        onCreated={setEditor}
        onChange={handleChange}
        disabled={disabled}
        mode="default"
        style={{ height }}
        placeholder={placeholder}
      />
    </div>
  );
}
