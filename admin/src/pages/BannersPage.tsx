import { useEffect, useState } from 'react';
import { Button, Card, Form, Image, Input, Modal, Popconfirm, Space, Switch, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { EnhancedUploadField, MediaPicker, StatusSwitch } from '../components/common';
import { siteContentService } from '../services/site-content-service';
import { BannerItem, CreateBannerPayload, UpdateBannerPayload } from '../types/site-content';
import { useMessage } from '../hooks/useMessage';
import { getErrorMessage, isFormValidationError } from '../lib/error-utils';

export function BannersPage() {
  const [bannerForm] = Form.useForm<BannerItem>();
  const [loading, setLoading] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const message = useMessage();

  async function loadBanners() {
    setLoading(true);
    try {
      const result = await siteContentService.listBanners();
      setBanners(result);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreateBanner() {
    setEditingBanner(null);
    bannerForm.resetFields();
    bannerForm.setFieldsValue({ sort: 0, status: 1 });
    setBannerModalOpen(true);
  }

  function handleOpenEditBanner(record: BannerItem) {
    setEditingBanner(record);
    bannerForm.setFieldsValue({
      title: record.title,
      subtitle: record.subtitle,
      imageUrl: record.imageUrl,
      linkUrl: record.linkUrl,
      sort: record.sort,
      status: record.status,
    });
    setBannerModalOpen(true);
  }

  async function handleSaveBanner() {
    try {
      const values = await bannerForm.validateFields();
      const imageUrl = values.imageUrl as string;

      if (!imageUrl) {
        message.error('请上传或输入图片地址');
        return;
      }

      const payload: CreateBannerPayload & { status?: number } = {
        title: values.title,
        subtitle: values.subtitle,
        imageUrl,
        linkUrl: values.linkUrl,
        sort: values.sort ?? 0,
        status: values.status ?? 1,
      };

      if (editingBanner) {
        const updatePayload: UpdateBannerPayload = {
          title: payload.title,
          subtitle: payload.subtitle,
          imageUrl: payload.imageUrl,
          linkUrl: payload.linkUrl,
          sort: payload.sort,
          status: payload.status,
        };
        await siteContentService.updateBanner(editingBanner.id, updatePayload);
        message.success('Banner 已更新');
      } else {
        await siteContentService.createBanner(payload as CreateBannerPayload);
        message.success('Banner 已创建');
      }
      setBannerModalOpen(false);
      bannerForm.resetFields();
      void loadBanners();
    } catch (error) {
      if (isFormValidationError(error)) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error(getErrorMessage(error, '操作失败'));
      }
    }
  }

  async function handleDeleteBanner(id: string) {
    await siteContentService.deleteBanner(id);
    message.success('Banner 已删除');
    void loadBanners();
  }

  async function handleToggleBannerStatus(id: string, currentStatus: number) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    await siteContentService.updateBannerStatus(id, newStatus);
    message.success(newStatus === 1 ? 'Banner 已启用' : 'Banner 已禁用');
    void loadBanners();
  }

  useEffect(() => {
    void loadBanners();
  }, []);

  const bannerColumns = [
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (value: string) => value ? <Image src={value} alt="Banner" style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 4 }} /> : '-',
    },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '副标题', dataIndex: 'subtitle', key: 'subtitle', render: (value: string) => value || '-' },
    { title: '链接', dataIndex: 'linkUrl', key: 'linkUrl', render: (value: string) => value ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : '-' },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: number, record: BannerItem) => (
        <Switch
          checked={value === 1}
          onChange={() => void handleToggleBannerStatus(record.id, value)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, record: BannerItem) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEditBanner(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除这个 Banner 吗？"
            onConfirm={() => void handleDeleteBanner(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>Banner 管理</Typography.Title>
        <Typography.Text type="secondary">管理首页轮播 Banner 图片，支持图片上传、排序和状态切换。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadBanners()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateBanner}>新增 Banner</Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={banners}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 个 Banner` }}
          columns={bannerColumns}
        />
      </Card>

      <Modal
        title={editingBanner ? '编辑 Banner' : '新增 Banner'}
        open={bannerModalOpen}
        onCancel={() => { setBannerModalOpen(false); setEditingBanner(null); }}
        footer={null}
        destroyOnHidden
        width={720}
      >
        <Form
          layout="vertical"
          form={bannerForm}
          onFinish={handleSaveBanner}
          initialValues={{ sort: 0, status: 1 }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="Banner 标题" />
          </Form.Item>
          <Form.Item label="副标题" name="subtitle">
            <Input placeholder="Banner 副标题（可选）" />
          </Form.Item>
          <Form.Item
            label="图片"
            name="imageUrl"
            rules={[{ required: true, message: '请上传或输入图片地址' }]}
          >
            <MediaPicker folder="banners" />
          </Form.Item>
          <Form.Item label="上传新图片">
            <EnhancedUploadField
              folder="banners"
              accept="image/*"
              onChange={(url) => bannerForm.setFieldValue('imageUrl', url)}
            />
          </Form.Item>
          <Form.Item label="跳转链接" name="linkUrl">
            <Input placeholder="https://example.com（可选）" />
          </Form.Item>
          <Form.Item label="排序" name="sort" tooltip="值越大越靠前">
            <Input type="number" placeholder="默认 0" />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="value" getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}>
            <StatusSwitch checkedLabel="启用" uncheckedLabel="禁用" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block icon={<SaveOutlined />}>
            {editingBanner ? '更新 Banner' : '保存 Banner'}
          </Button>
        </Form>
      </Modal>
    </Space>
  );
}
