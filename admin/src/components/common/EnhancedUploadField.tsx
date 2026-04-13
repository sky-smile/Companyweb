import { useEffect, useState } from 'react';
import { Button, Image, Input, Space, Upload } from 'antd';
import { DeleteOutlined, EyeOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { uploadService } from '../../services/upload-service';
import { useMessage } from '../../hooks/useMessage';

interface EnhancedUploadFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  folder: string;
  accept?: string;
  maxFileSize?: number; // bytes, default 10MB
  showPreview?: boolean;
  disabled?: boolean;
}

export function EnhancedUploadField({
  value,
  onChange,
  folder,
  accept = 'image/*',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  showPreview = true,
  disabled = false,
}: EnhancedUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const message = useMessage();

  useEffect(() => {
    if (value) {
      setFileList([
        {
          uid: '-1',
          name: value.split('/').pop() || 'image',
          status: 'done',
          url: value,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleRemove = () => {
    onChange?.('');
    setFileList([]);
    message.success('已删除');
  };

  const handleBeforeUpload = (file: File) => {
    if (file.size > maxFileSize) {
      message.error(`文件大小不能超过 ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return false;
    }
    return true;
  };

  const handleUploadChange = async (file: File) => {
    setUploading(true);
    try {
      const result = accept.startsWith('image')
        ? await uploadService.uploadImage(file, folder)
        : await uploadService.uploadFile(file, folder);

      onChange?.(result.publicUrl);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (value && showPreview) {
    return (
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Image
            src={value}
            alt="预览"
            style={{
              maxWidth: '100%',
              maxHeight: 200,
              objectFit: 'contain',
              borderRadius: 8,
              border: '1px solid var(--ant-color-border)',
            }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            disabled={disabled}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          />
        </div>
        <Input value={value} readOnly />
      </Space>
    );
  }

  return (
    <Upload.Dragger
      accept={accept}
      showUploadList={false}
      beforeUpload={handleBeforeUpload}
      customRequest={({ file }) => handleUploadChange(file as File)}
      disabled={disabled}
      style={{ padding: 24 }}
    >
      <p className="ant-upload-drag-icon">
        {uploading ? <InboxOutlined spin /> : <UploadOutlined />}
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
      <p className="ant-upload-hint">
        支持单个文件，大小不超过 {Math.round(maxFileSize / 1024 / 1024)}MB
      </p>
    </Upload.Dragger>
  );
}
