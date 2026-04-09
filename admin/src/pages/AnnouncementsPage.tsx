import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Table, Tag, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { announcementService } from '../services/announcement-service';
import { AnnouncementItem, CreateAnnouncementPayload } from '../types/announcement';

export function AnnouncementsPage() {
  const [form] = Form.useForm<CreateAnnouncementPayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  async function handleCreate(values: CreateAnnouncementPayload) {
    await announcementService.create(values);
    message.success('公告已创建');
    setModalOpen(false);
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
        <Typography.Text type="secondary">当前已接上公告列表，可继续扩展编辑、删除和发布流程。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增公告</Button>
          </Space>
        }
      >
        <Table rowKey="id" loading={loading} columns={columns} dataSource={items} pagination={false} />
      </Card>

      <Modal title="新增公告" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnHidden>
        <Form layout="vertical" form={form} onFinish={handleCreate} initialValues={{ status: 0, isTop: 0 }}>
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
