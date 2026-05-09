import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, KeyOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { adminUserService } from '../services/admin-user-service';
import { roleService } from '../services/role-service';
import { http, unwrapResponse } from '../services/http';
import { AdminUserItem, CreateAdminUserPayload, UpdateAdminUserPayload } from '../types/admin-user';
import { RoleItem } from '../types/role';
import { useMessage } from '../hooks/useMessage';
import { authStore } from '../stores/auth-store';

export function AdminUsersPage() {
  const [createForm] = Form.useForm<CreateAdminUserPayload>();
  const [editForm] = Form.useForm<UpdateAdminUserPayload>();
  const [passwordForm] = Form.useForm<{ newPassword: string; confirmPassword: string }>();
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUserItem | null>(null);
  const [data, setData] = useState<AdminUserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);
  const message = useMessage();

  const columns = useMemo(
    () => [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        render: (value: string, record: AdminUserItem) => (
          <Space>
            <UserOutlined style={{ color: '#1890ff' }} />
            <strong>{value}</strong>
            {record.isSuperAdmin && <Tag color="purple">超级管理员</Tag>}
          </Space>
        ),
      },
      { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
      { title: '邮箱', dataIndex: 'email', key: 'email', width: 180, render: (value: string) => value || '-' },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        width: 200,
        render: (roleCodes: string[]) => (
          <Space wrap>
            {roleCodes.length === 0 ? <Tag>未分配</Tag> : roleCodes.map((code) => {
              const role = roles.find(r => r.code === code);
              return <Tag key={code} color="blue">{role?.name || code}</Tag>;
            })}
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
            disabled={record.isSuperAdmin || !authStore.hasPermission('admin-users:status')}
            onChange={async (checked) => {
              await adminUserService.updateStatus(record.id, checked ? 1 : 0);
              message.success('状态已更新');
              void loadData();
            }}
          />
        ),
      },
      {
        title: '操作',
        key: 'actions',
        width: 320,
        render: (_: unknown, record: AdminUserItem) => (
          <Space>
            <Button
              icon={<UserOutlined />}
              size="small"
              disabled={record.isSuperAdmin || !authStore.hasPermission('admin-users:update')}
              onClick={() => {
                setEditingUser(record);
                editForm.setFieldsValue({
                  nickname: record.nickname,
                  email: record.email,
                  phone: record.phone,
                  roleIds: record.roles
                    .map((code) => roles.find((r) => r.code === code)?.id)
                    .filter((id): id is string => id !== undefined),
                });
                setEditModalOpen(true);
              }}
            >
              编辑
            </Button>
            <Button
              icon={<KeyOutlined />}
              size="small"
              disabled={!authStore.hasPermission('admin-users:reset-password')}
              onClick={() => {
                setResetPasswordUser(record);
                passwordForm.resetFields();
                setPasswordModalOpen(true);
              }}
            >
              重置密码
            </Button>
            <Popconfirm
              title="确认删除该管理员？"
              description="删除后无法恢复"
              onConfirm={async () => {
                await adminUserService.delete(record.id);
                message.success('管理员已删除');
                void loadData();
              }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                disabled={record.isSuperAdmin || !authStore.hasPermission('admin-users:delete')}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [roles, editForm, passwordForm],
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
      const [userResult, roleResult] = await Promise.allSettled([
        adminUserService.list({ pageSize: 1000 }),
        http.get('/roles', { silent: true } as Record<string, unknown>).then((res) => unwrapResponse<RoleItem[]>(res)),
      ]);
      setData(userResult.status === 'fulfilled' ? userResult.value.list : []);
      setRoles(roleResult.status === 'fulfilled' ? roleResult.value : []);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(values: UpdateAdminUserPayload) {
    if (!editingUser) return;
    // 过滤空值，避免触发后端 @IsEmail 验证
    const payload: UpdateAdminUserPayload = {
      nickname: values.nickname,
      email: values.email || undefined,
      phone: values.phone || undefined,
      roleIds: values.roleIds,
    };
    await adminUserService.update(editingUser.id, payload);
    message.success('管理员信息已更新');
    setEditModalOpen(false);
    setEditingUser(null);
    editForm.resetFields();
    void loadData();
  }

  async function handleCreate(values: CreateAdminUserPayload) {
    // 过滤空值
    const payload: CreateAdminUserPayload = {
      username: values.username,
      password: values.password,
      nickname: values.nickname,
      email: values.email || undefined,
      phone: values.phone || undefined,
      roleIds: values.roleIds,
    };
    await adminUserService.create(payload);
    message.success('管理员已创建');
    setCreateModalOpen(false);
    createForm.resetFields();
    void loadData();
  }

  async function handleResetPassword(values: { newPassword: string }) {
    if (!resetPasswordUser) return;
    await adminUserService.resetPassword(resetPasswordUser.id, values.newPassword);
    message.success('密码已重置');
    setPasswordModalOpen(false);
    setResetPasswordUser(null);
    passwordForm.resetFields();
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                disabled={!authStore.hasPermission('admin-users:create')}
                onClick={() => setCreateModalOpen(true)}
              >
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

      {/* 新增管理员弹窗 */}
      <Modal
        title="新增管理员"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={createForm} onFinish={handleCreate}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="登录用的用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 10, message: '密码至少 10 个字符，需大小写字母和数字' },
            ]}
          >
            <Input.Password placeholder="至少 10 个字符，需大小写字母和数字" />
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

      {/* 编辑管理员弹窗 */}
      <Modal
        title="编辑管理员"
        open={editModalOpen}
        onCancel={() => { setEditModalOpen(false); setEditingUser(null); }}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={editForm} onFinish={handleEdit}>
          <Form.Item label="用户名">
            <Input value={editingUser?.username} disabled />
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
          <Button type="primary" htmlType="submit" block>更新管理员</Button>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={passwordModalOpen}
        onCancel={() => { setPasswordModalOpen(false); setResetPasswordUser(null); }}
        footer={null}
        destroyOnHidden
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          正在为 <strong>{resetPasswordUser?.username}</strong> 重置密码
        </Typography.Paragraph>
        <Form layout="vertical" form={passwordForm} onFinish={handleResetPassword}>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 10, message: '密码至少 10 个字符，需大小写字母和数字' },
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="请输入新密码（至少 10 个字符，需大小写字母和数字）" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="请再次输入新密码" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block icon={<KeyOutlined />}>
            重置密码
          </Button>
        </Form>
      </Modal>
    </Space>
  );
}
