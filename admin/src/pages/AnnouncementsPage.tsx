import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { EnhancedUploadField, PublishStatus, RichTextEditor, StatusSwitch } from '../components/common';
import { announcementService } from '../services/announcement-service';
import { AnnouncementItem, CreateAnnouncementPayload } from '../types/announcement';

export function AnnouncementsPage() {
  const [form] = Form.useForm<CreateAnnouncementPayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);

  const columns = useMemo(
    () => [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (value: number) => (value === 1 ? <Tag color="green">已发布</Tag> : <Tag>草稿</Tag>),
      },
      {
        title: '置顶',
        dataIndex: 'isTop',
        key: 'isTop',
        width: 100,
        render: (value: number, record: AnnouncementItem) => (
          <StatusSwitch
            checkedLabel="置顶"
            uncheckedLabel="普通"
            value={value}
            onChange={async (newValue) => {
              await announcementService.update(record.id, { ...record, isTop: newValue });
              message.success(newValue === 1 ? '已设为置顶' : '已取消置顶');
              void loadData();
            }}
          />
        ),
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (_: unknown, record: AnnouncementItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
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
              <Button danger icon={<DeleteOutlined />} size="small">删除</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = searchText
        ? item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.summary && item.summary.toLowerCase().includes(searchText.toLowerCase()))
        : true;
      const matchStatus = filterStatus !== undefined ? item.status === filterStatus : true;
      return matchSearch && matchStatus;
    });
  }, [items, searchText, filterStatus]);

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
        <Typography.Text type="secondary">管理公司公告和通知，支持富文本编辑和置顶功能。</Typography.Text>
      </div>

      <Card>
        <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <Input
                placeholder="搜索标题或摘要"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 240 }}
                allowClear
              />
              <Select
                placeholder="筛选状态"
                value={filterStatus}
                onChange={(val) => setFilterStatus(val)}
                style={{ width: 140 }}
                allowClear
                options={[
                  { label: '已发布', value: 1 },
                  { label: '草稿', value: 0 },
                ]}
              />
            </Space>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingItem(null);
                  form.resetFields();
                  form.setFieldsValue({ status: 0, isTop: 0 });
                  setModalOpen(true);
                }}
              >
                新增公告
              </Button>
            </Space>
          </Space>

          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredItems}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
          />
        </Space>
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
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleSave} initialValues={{ status: 0, isTop: 0 }}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="公告标题" />
          </Form.Item>
          <Form.Item label="摘要" name="summary">
            <Input.TextArea rows={3} placeholder="公告简要摘要" />
          </Form.Item>
          <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文内容' }]}>
            <RichTextEditor height={400} placeholder="请输入公告正文..." />
          </Form.Item>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Form.Item label="状态" name="status" valuePropName="value" getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}>
              <PublishStatus />
            </Form.Item>
            <Form.Item label="置顶" name="isTop" valuePropName="checked" getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}>
              <StatusSwitch checkedLabel="置顶" uncheckedLabel="普通" />
            </Form.Item>
          </Space>
          <Button type="primary" htmlType="submit" block>
            {editingItem === null ? '创建公告' : '更新公告'}
          </Button>
        </Form>
      </Modal>
    </Space>
  );
}
