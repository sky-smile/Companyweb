import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Select, Space, Switch, Table, Tag, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { adminUserService } from '../services/admin-user-service';
import { roleService } from '../services/role-service';
import { AdminUserItem, CreateAdminUserPayload } from '../types/admin-user';
import { RoleItem } from '../types/role';

export function AdminUsersPage() {
  const [form] = Form.useForm<CreateAdminUserPayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<AdminUserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);

  const columns = useMemo(
    () => [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
      },
      { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
      { title: '邮箱', dataIndex: 'email', key: 'email', width: 180, render: (value: string) => value || '-' },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        width: 200,
        render: (roles: string[]) => (
          <Space wrap>
            {roles.length === 0 ? <Tag>未分配</Tag> : roles.map((role) => <Tag key={role} color="blue">{role}</Tag>)}
          </Space>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (_: number, record: AdminUserItem) => (
          <Switch
            checked={record.status === 1}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            disabled={record.isSuperAdmin}
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

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchSearch = searchText
        ? user.username.toLowerCase().includes(searchText.toLowerCase()) ||
          user.nickname.toLowerCase().includes(searchText.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(searchText.toLowerCase()))
        : true;
      const matchRole = filterRole
        ? user.roles.includes(filterRole)
        : true;
      return matchSearch && matchRole;
    });
  }, [data, searchText, filterRole]);

  async function loadData() {
    setLoading(true);
    try {
      const [userResult, roleResult] = await Promise.all([
        adminUserService.list(),
        roleService.list(),
      ]);
      setData(userResult.list);
      setRoles(roleResult);
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
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>账号管理</Typography.Title>
        <Typography.Text type="secondary">管理系统管理员账号和权限，支持搜索和筛选功能。</Typography.Text>
      </div>

      <Card>
        <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <Input
                placeholder="搜索用户名、昵称或邮箱"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 260 }}
                allowClear
              />
              <Select
                placeholder="筛选角色"
                value={filterRole}
                onChange={(val) => setFilterRole(val)}
                style={{ width: 160 }}
                allowClear
                options={roles.map((role) => ({ label: role.name, value: role.name }))}
              />
            </Space>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                新增管理员
              </Button>
            </Space>
          </Space>

          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 个管理员` }}
          />
        </Space>
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
            <Input placeholder="登录用的用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少 8 个字符' },
            ]}
          >
            <Input.Password placeholder="至少 8 个字符" />
          </Form.Item>
          <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="显示名称" />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}>
            <Input placeholder="example@email.com" />
          </Form.Item>
          <Form.Item label="手机" name="phone">
            <Input placeholder="可选，手机号码" />
          </Form.Item>
          <Form.Item label="角色" name="roleIds">
            <Select
              mode="multiple"
              placeholder="选择角色（可多选）"
              options={roles.map((role) => ({ label: role.name, value: role.id }))}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>保存管理员</Button>
        </Form>
      </Modal>
    </Space>
  );
}
