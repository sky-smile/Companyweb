import { useEffect, useState } from 'react';
import { Button, Image, Input, message, Space, Upload } from 'antd';
import { DeleteOutlined, EyeOutlined, InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { uploadService } from '../../services/upload-service';

interface MultiImageUploadFieldProps {
  value?: string; // JSON string of image URLs array
  onChange?: (value: string) => void;
  folder: string;
  accept?: string;
  maxFileSize?: number; // bytes, default 10MB
  maxCount?: number; // max number of images, default 5
  disabled?: boolean;
}

export function MultiImageUploadField({
  value,
  onChange,
  folder,
  accept = 'image/*',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxCount = 5,
  disabled = false,
}: MultiImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Parse JSON value to array
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setImageUrls(parsed);
        } else {
          setImageUrls([]);
        }
      } catch {
        // If not valid JSON, treat as single URL
        setImageUrls(value ? [value] : []);
      }
    } else {
      setImageUrls([]);
    }
  }, [value]);

  // Update parent form when images change
  const updateValue = (urls: string[]) => {
    setImageUrls(urls);
    onChange?.(urls.length > 0 ? JSON.stringify(urls) : '');
  };

  const handleRemove = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    updateValue(newUrls);
    message.success('已删除');
  };

  const handleBeforeUpload = (file: File) => {
    if (file.size > maxFileSize) {
      message.error(`文件大小不能超过 ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return false;
    }
    if (imageUrls.length >= maxCount) {
      message.error(`最多只能上传 ${maxCount} 张图片`);
      return false;
    }
    return true;
  };

  const handleUploadChange = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadService.uploadImage(file, folder);
      const newUrls = [...imageUrls, result.publicUrl];
      updateValue(newUrls);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    updateValue(newUrls);
  };

  const handleAddInput = () => {
    if (imageUrls.length >= maxCount) {
      message.error(`最多只能上传 ${maxCount} 张图片`);
      return;
    }
    updateValue([...imageUrls, '']);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* Image Previews */}
      {imageUrls.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {imageUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative' }}>
              {url ? (
                <div style={{ position: 'relative' }}>
                  <Image
                    src={url}
                    alt={`图片 ${index + 1}`}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
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
                    onClick={() => handleRemove(index)}
                    disabled={disabled}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(255, 255, 255, 0.9)',
                    }}
                  />
                </div>
              ) : (
                <Input
                  placeholder="输入图片 URL"
                  value={url}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  style={{ width: 200 }}
                  addonAfter={
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                    />
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {imageUrls.length < maxCount && (
        <Upload.Dragger
          accept={accept}
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          customRequest={({ file }) => handleUploadChange(file as File)}
          disabled={disabled || uploading}
          style={{ padding: 24 }}
        >
          <p className="ant-upload-drag-icon">
            {uploading ? <InboxOutlined spin /> : <UploadOutlined />}
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个文件，大小不超过 {Math.round(maxFileSize / 1024 / 1024)}MB
            {maxCount > 1 && `，最多 ${maxCount} 张图片（已上传 ${imageUrls.length} 张）`}
          </p>
        </Upload.Dragger>
      )}

      {/* Add URL Button */}
      {imageUrls.length < maxCount && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddInput}
          disabled={disabled}
          block
        >
          添加图片 URL
        </Button>
      )}

      {/* Hidden input to store JSON value */}
      <Input type="hidden" value={value} />
    </Space>
  );
}
