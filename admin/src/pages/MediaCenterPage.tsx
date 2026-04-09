import { useState } from 'react';
import { Button, Card, Input, List, Segmented, Space, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { UploadField } from '../components/common/UploadField';
import { UploadedFileItem } from '../types/upload';

export function MediaCenterPage() {
  const [mode, setMode] = useState<'image' | 'file'>('image');
  const [folder, setFolder] = useState('common');
  const [currentUrl, setCurrentUrl] = useState('');
  const [records, setRecords] = useState<UploadedFileItem[]>([]);

  function handleUploaded(url: string) {
    const record: UploadedFileItem = {
      originalName: url.split('/').pop() ?? '',
      mimeType: mode === 'image' ? 'image/*' : 'file/*',
      size: 0,
      filename: url.split('/').pop() ?? '',
      storagePath: url,
      publicUrl: url,
    };

    setCurrentUrl(url);
    setRecords((prev) => [record, ...prev]);
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    message.success('链接已复制');
  }

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>媒体中心</Typography.Title>
        <Typography.Text type="secondary">当前已接上图片与文件上传，可直接复制 URL 回填到 Banner、新闻和产品表单。</Typography.Text>
      </div>

      <Card>
        <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
          <Segmented
            value={mode}
            options={[
              { label: '图片上传', value: 'image' },
              { label: '文件上传', value: 'file' },
            ]}
            onChange={(value) => setMode(value as 'image' | 'file')}
          />
          <Input value={folder} onChange={(event) => setFolder(event.target.value)} placeholder="上传目录，如 banners / news / products" />
          <UploadField
            value={currentUrl}
            onChange={handleUploaded}
            folder={folder}
            accept={mode === 'image' ? 'image/*' : undefined}
            buttonText={mode === 'image' ? '上传图片' : '上传文件'}
          />
        </Space>
      </Card>

      <Card title="最近上传">
        <List
          dataSource={records}
          locale={{ emptyText: '上传后会在这里显示可复制链接' }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="copy" icon={<CopyOutlined />} onClick={() => void copyUrl(item.publicUrl)}>
                  复制链接
                </Button>,
              ]}
            >
              <List.Item.Meta title={item.filename} description={item.publicUrl} />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}
