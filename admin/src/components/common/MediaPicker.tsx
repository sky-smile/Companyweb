import { useState } from 'react';
import { Button, Image, Input, Modal, Space, Table, Typography, message } from 'antd';
import { PictureOutlined, SearchOutlined } from '@ant-design/icons';
import { uploadService } from '../../services/upload-service';
import type { MediaFile } from '../../types/upload';

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

  async function loadFiles() {
    setLoading(true);
    try {
      const response: any = await uploadService.getFiles(1, 50, {
        type: 'image',
        folder: folder || undefined,
        keyword: keyword || undefined,
      });
      setFiles(response.items || []);
    } catch (error: any) {
      message.error(error.message || '加载文件失败');
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(file: MediaFile) {
    onChange?.(file.publicUrl);
    setOpen(false);
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
    <Space.Compact style={{ width: '100%' }}>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="从媒体中心选择或直接输入图片 URL"
      />
      <Button
        icon={<PictureOutlined />}
        onClick={() => {
          console.log('[MediaPicker] Button clicked, opening modal...');
          setOpen(true);
        }}
      >
        从媒体中心选择
      </Button>

      <Modal
        title="从媒体中心选择图片"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
        destroyOnHidden
        afterOpenChange={(open) => {
          console.log('[MediaPicker] Modal open changed:', open);
          if (open) {
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
    </Space.Compact>
  );
}
