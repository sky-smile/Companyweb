import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { announcementService } from '../services/announcement-service';
import { AnnouncementItem, CreateAnnouncementPayload } from '../types/announcement';

export function AnnouncementsPage() {
  const [form] = Form.useForm<CreateAnnouncementPayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [items, setItems] = useState<AnnouncementItem[]>([]);

  const columns = useMemo(
    () => [
      { title: '标题', dataIndex: 'title', key: 'title' },
      { title: '摘要', dataIndex: 'summary', key: 'summary', render: (value: string) => value || '-' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value: number) => (value === 1 ? <Tag color="green">已发布</Tag> : <Tag>草稿</Tag>),
      },
      {
        title: '置顶',
        dataIndex: 'isTop',
        key: 'isTop',
        render: (value: number) => (value === 1 ? <Tag color="blue">置顶</Tag> : <Tag>普通</Tag>),
      },
      {
        title: '操作',
        key: 'actions',
        render: (_: unknown, record: AnnouncementItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={async () => {
                const detail = await announcementService.detail(record.id);
                setEditingItem(detail);
                form.setFieldsValue(detail);
                setModalOpen(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除这条公告吗？"
              onConfirm={async () => {
                await announcementService.delete(record.id);
                message.success('公告已删除');
                void loadData();
              }}
            >
              <Button danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  async function loadData() {
    setLoading(true);
    try {
      const result = await announcementService.list();
      setItems(result.list);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(values: CreateAnnouncementPayload) {
    if (editingItem === null) {
      await announcementService.create(values);
      message.success('公告已创建');
    } else {
      await announcementService.update(editingItem.id, values);
      message.success('公告已更新');
    }

    setModalOpen(false);
    setEditingItem(null);
    form.resetFields();
    void loadData();
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>公告管理</Typography.Title>
        <Typography.Text type="secondary">现在已经接上公告的完整 CRUD 流程，可继续补富文本与附件上传回填。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setModalOpen(true); }}>新增公告</Button>
          </Space>
        }
      >
        <Table rowKey="id" loading={loading} columns={columns} dataSource={items} pagination={false} />
      </Card>

      <Modal
        title={editingItem === null ? '新增公告' : '编辑公告'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleSave} initialValues={{ status: 0, isTop: 0 }}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="摘要" name="summary"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文内容' }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item label="状态" name="status"><Input type="number" /></Form.Item>
          <Form.Item label="置顶" name="isTop"><Input type="number" /></Form.Item>
          <Button type="primary" htmlType="submit" block>保存公告</Button>
        </Form>
      </Modal>
    </Space>
  );
}
