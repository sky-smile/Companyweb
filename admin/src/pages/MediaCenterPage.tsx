import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Segmented,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FileOutlined,
  FolderOutlined,
  PictureOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { uploadService } from '../services/upload-service';
import { FolderSelector } from '../components/common';
import { useMessage } from '../hooks/useMessage';
import { getErrorMessage } from '../lib/error-utils';

const { Dragger } = Upload;

interface MediaFile {
  id: number;
  originalName: string;
  filename: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  size: number;
  extension: string;
  folder: string;
  width: number | null;
  height: number | null;
  thumbnailUrl: string | null;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface MediaStatistics {
  total: number;
  images: number;
  documents: number;
  others: number;
  byFolder: Array<{ folder: string; count: string }>;
}

export function MediaCenterPage() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFolder, setFilterFolder] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const [statistics, setStatistics] = useState<MediaStatistics | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState('common');
  const message = useMessage();

  useEffect(() => {
    loadFiles();
    loadStatistics();
  }, [page, filterType, filterFolder, keyword]);

  async function loadFiles() {
    setLoading(true);
    try {
      const typeParam = filterType === 'all' ? undefined : filterType === 'image' ? 'image' : undefined;
      const response = await uploadService.getFiles(page, limit, {
        folder: filterFolder || undefined,
        type: typeParam,
        keyword: keyword || undefined,
      });

      setFiles(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      message.error(getErrorMessage(error, '加载文件列表失败'));
    } finally {
      setLoading(false);
    }
  }

  async function loadStatistics() {
    try {
      const response = await uploadService.getStatistics();
      setStatistics(response.data || null);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await uploadService.deleteFile(id);
      message.success('删除成功');
      loadFiles();
      loadStatistics();
    } catch (error) {
      message.error(getErrorMessage(error, '删除失败'));
    }
  }

  async function handleCopyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    message.success('链接已复制到剪贴板');
  }

  function handlePreview(file: MediaFile) {
    if (file.mimeType.startsWith('image/')) {
      setPreviewImage(file.publicUrl);
      setPreviewVisible(true);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function getFileIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) {
      return <PictureOutlined style={{ color: '#1890ff' }} />;
    }
    return <FileOutlined />;
  }

  const uploadProps = {
    name: 'file',
    multiple: true,
    customRequest: async ({ file, onSuccess, onError }: { file: unknown; onSuccess?: (body: unknown) => void; onError?: (err: unknown) => void }) => {
      setUploading(true);
      try {
        const isImage = (file as File).type.startsWith('image/');
        const response = await (isImage
          ? uploadService.uploadImage(file as File, uploadFolder)
          : uploadService.uploadFile(file as File, uploadFolder));

        message.success(`${(file as File).name} 上传成功`);
        onSuccess?.(response);
        loadFiles();
        loadStatistics();
      } catch (error) {
        message.error(`${(file as File).name} 上传失败: ${getErrorMessage(error)}`);
        onError?.(error);
      } finally {
        setUploading(false);
      }
    },
    onRemove: async (file: UploadFile) => {
      if (file.response?.data?.mediaFile?.id) {
        await handleDelete(file.response.data.mediaFile.id);
      }
      return true;
    },
  };

  const columns = [
    {
      title: '预览',
      dataIndex: 'publicUrl',
      key: 'preview',
      width: 80,
      render: (url: string, record: MediaFile) => (
        <Space>
          {record.mimeType.startsWith('image/') ? (
            <Image
              src={record.thumbnailUrl || url}
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
              preview={false}
              onClick={() => handlePreview(record)}
            />
          ) : (
            getFileIcon(record.mimeType)
          )}
        </Space>
      ),
    },
    {
      title: '文件名',
      dataIndex: 'originalName',
      key: 'originalName',
      ellipsis: true,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '目录',
      dataIndex: 'folder',
      key: 'folder',
      width: 120,
      render: (folder: string) => (
        <Tag icon={<FolderOutlined />} color="blue">
          {folder}
        </Tag>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '尺寸',
      key: 'dimensions',
      width: 120,
      render: (_: unknown, record: MediaFile) => {
        if (record.width && record.height) {
          return `${record.width} × ${record.height}`;
        }
        return '-';
      },
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: MediaFile) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopyUrl(record.publicUrl)}
          >
            复制链接
          </Button>
          <Popconfirm
            title="确定删除此文件？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex', width: '100%' }}>
      {/* 页面标题 */}
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          媒体中心
        </Typography.Title>
        <Typography.Text type="secondary">
          管理所有上传的图片和文件，支持批量上传、预览、搜索和删除操作。
        </Typography.Text>
      </div>

      {/* 统计信息 */}
      {statistics && (
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="文件总数"
                value={statistics.total}
                prefix={<FileOutlined />}
                styles={{ content: { color: '#1890ff' } }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="图片"
                value={statistics.images}
                prefix={<PictureOutlined />}
                styles={{ content: { color: '#52c41a' } }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="文档"
                value={statistics.documents}
                prefix={<FileImageOutlined />}
                styles={{ content: { color: '#faad14' } }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="其他"
                value={statistics.others}
                styles={{ content: { color: '#722ed1' } }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 上传区域 */}
      <Card title="上传文件">
        <Space direction="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
          <Space>
            <span>上传到目录：</span>
            <FolderSelector
              value={uploadFolder}
              onChange={(folder) => setUploadFolder(folder)}
            />
          </Space>

          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持批量上传，图片最大 10MB，文件将上传到 <Tag color="blue" style={{ margin: '0 4px' }}>{uploadFolder}</Tag> 目录
            </p>
          </Dragger>
        </Space>
      </Card>

      {/* 文件列表 */}
      <Card
        title="文件列表"
        extra={
          <Button icon={<ReloadOutlined />} onClick={loadFiles} loading={loading}>
            刷新
          </Button>
        }
      >
        <Space direction="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
          {/* 筛选和搜索 */}
          <Space wrap>
            <Segmented
              value={filterType}
              options={[
                { label: '全部', value: 'all' },
                { label: '图片', value: 'image' },
              ]}
              onChange={(value) => {
                setFilterType(value as string);
                setPage(1);
              }}
            />

            <Select
              style={{ width: 150 }}
              placeholder="选择目录"
              allowClear
              value={filterFolder || undefined}
              onChange={(value) => {
                setFilterFolder(value || '');
                setPage(1);
              }}
              options={
                statistics?.byFolder.map((item) => ({
                  label: `${item.folder} (${item.count})`,
                  value: item.folder,
                })) || []
              }
            />

            <Input.Search
              placeholder="搜索文件名"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={() => setPage(1)}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Space>

          {/* 表格 */}
          <Spin spinning={loading}>
            {files.length > 0 ? (
              <>
                <Table
                  dataSource={files}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <Pagination
                    current={page}
                    total={total}
                    pageSize={limit}
                    showSizeChanger={false}
                    showTotal={(total) => `共 ${total} 个文件`}
                    onChange={(newPage) => setPage(newPage)}
                  />
                </div>
              </>
            ) : (
              <Empty description={loading ? '加载中...' : '暂无文件'} />
            )}
          </Spin>
        </Space>
      </Card>

      {/* 图片预览 */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ top: 20 }}
      >
        <Image
          src={previewImage}
          style={{ width: '100%' }}
          preview={false}
        />
      </Modal>
    </Space>
  );
}
