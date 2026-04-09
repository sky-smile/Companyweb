import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Switch, Table, Tag, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { adminUserService } from '../services/admin-user-service';
import { AdminUserItem, CreateAdminUserPayload } from '../types/admin-user';

export function AdminUsersPage() {
  const [form] = Form.useForm<CreateAdminUserPayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<AdminUserItem[]>([]);

  const columns = useMemo(
    () => [
      { title: '用户名', dataIndex: 'username', key: 'username' },
      { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
      { title: '邮箱', dataIndex: 'email', key: 'email', render: (value: string) => value || '-' },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        render: (roles: string[]) => (
          <Space wrap>
            {roles.length === 0 ? <Tag>未分配</Tag> : roles.map((role) => <Tag key={role}>{role}</Tag>)}
          </Space>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (_: number, record: AdminUserItem) => (
          <Switch
            checked={record.status === 1}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            onChange={async (checked) => {
              await adminUserService.updateStatus(record.id, checked ? 1 : 0);
              message.success('状态已更新');
              void loadData();
            }}
          />
        ),
      },
    ],
    [],
  );

  async function loadData() {
    setLoading(true);
    try {
      const result = await adminUserService.list();
      setData(result.list);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(values: CreateAdminUserPayload) {
    await adminUserService.create(values);
    message.success('管理员已创建');
    setModalOpen(false);
    form.resetFields();
    void loadData();
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <Space direction="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>账号管理</Typography.Title>
        <Typography.Text type="secondary">已经接上管理员列表、创建与启用禁用操作。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增管理员</Button>
          </Space>
        }
      >
        <Table rowKey="id" loading={loading} columns={columns} dataSource={data} pagination={false} />
      </Card>

      <Modal
        title="新增管理员"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleCreate}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email"><Input /></Form.Item>
          <Form.Item label="手机" name="phone"><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block>保存管理员</Button>
        </Form>
      </Modal>
    </Space>
  );
}
