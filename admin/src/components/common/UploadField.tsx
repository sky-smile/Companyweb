import { useState } from 'react';
import { Button, Input, Space, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadService } from '../../services/upload-service';

interface UploadFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  folder: string;
  accept?: string;
  buttonText?: string;
}

export function UploadField({ value, onChange, folder, accept, buttonText = '上传文件' }: UploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file === undefined) {
      return;
    }

    setUploading(true);
    try {
      const result = accept?.startsWith('image')
        ? await uploadService.uploadImage(file, folder)
        : await uploadService.uploadFile(file, folder);

      onChange?.(result.publicUrl);
      message.success('上传成功');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input value={value} onChange={(event) => onChange?.(event.target.value)} placeholder="可手动输入或上传后自动回填" />
      <label>
        <input type="file" accept={accept} style={{ display: 'none' }} onChange={handleFileChange} />
        <Button icon={<UploadOutlined />} loading={uploading}>{buttonText}</Button>
      </label>
    </Space.Compact>
  );
}
