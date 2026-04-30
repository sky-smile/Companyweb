import { useState, useEffect } from 'react';
import { Button, Image, Input, Modal, Space, Table, Typography } from 'antd';
import { PictureOutlined, SearchOutlined } from '@ant-design/icons';
import { uploadService } from '../../services/upload-service';
import type { MediaFile } from '../../types/upload';
import { useMessage } from '../../hooks/useMessage';
import { getErrorMessage } from '../../lib/error-utils';

interface MediaPickerProps {
  value?: string;
  onChange?: (url: string) => void;
  folder?: string;
}

export function MediaPicker({ value, onChange, folder }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const message = useMessage();

  // 当外部 value 变化时同步到内部输入框
  const [inputValue, setInputValue] = useState(value || '');
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  async function loadFiles() {
    setLoading(true);
    try {
      const response = await uploadService.getFiles(1, 50, {
        type: 'image',
        folder: folder || undefined,
        keyword: keyword || undefined,
      });
      setFiles(response.items || []);
    } catch (error) {
      message.error(getErrorMessage(error, '加载文件失败'));
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(file: MediaFile) {
    onChange?.(file.publicUrl);
    setOpen(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  }

  const columns = [
    {
      title: '预览',
      dataIndex: 'publicUrl',
      key: 'preview',
      width: 80,
      render: (_: string, record: MediaFile) => (
        <Image
          src={record.thumbnailUrl || record.publicUrl}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          preview={false}
        />
      ),
    },
    {
      title: '文件名',
      dataIndex: 'originalName',
      key: 'originalName',
      ellipsis: true,
    },
    {
      title: '目录',
      dataIndex: 'folder',
      key: 'folder',
      width: 100,
    },
    {
      title: '尺寸',
      key: 'dimensions',
      width: 100,
      render: (_: unknown, record: MediaFile) =>
        record.width && record.height ? `${record.width} × ${record.height}` : '-',
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: unknown, record: MediaFile) => (
        <Button type="link" size="small" onClick={() => handleSelect(record)}>
          选择
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 已选图片预览 */}
      {value && (
        <div style={{ marginBottom: 12 }}>
          <Image
            src={value}
            alt="已选图片"
            style={{ maxWidth: 300, maxHeight: 120, objectFit: 'contain', borderRadius: 8, border: '1px solid #f0f0f0' }}
          />
        </div>
      )}

      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="从媒体中心选择或直接输入图片 URL"
        />
        <Button
          icon={<PictureOutlined />}
          onClick={() => {
            setOpen(true);
          }}
        >
          从媒体中心选择
        </Button>
      </Space.Compact>

      <Modal
        title="从媒体中心选择图片"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
        destroyOnHidden
        afterOpenChange={(isOpen) => {
          if (isOpen) {
            void loadFiles();
          }
        }}
      >
        <Space style={{ marginBottom: 16, width: '100%' }}>
          <Input.Search
            placeholder="搜索文件名"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => void loadFiles()}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            allowClear
          />
          {folder && (
            <Typography.Text type="secondary">目录: {folder}</Typography.Text>
          )}
        </Space>

        <Table
          dataSource={files}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 张图片` }}
          locale={{ emptyText: '暂无图片，请先上传' }}
        />
      </Modal>
    </div>
  );
}
