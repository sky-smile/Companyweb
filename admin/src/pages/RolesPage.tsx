import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Checkbox, Form, Input, Modal, Space, Table, Tag, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { roleService } from '../services/role-service';
import { CreateRolePayload, PermissionItem, RoleItem } from '../types/role';

export function RolesPage() {
  const [form] = Form.useForm<CreateRolePayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);

  const columns = useMemo(
    () => [
      { title: '角色名称', dataIndex: 'name', key: 'name' },
      { title: '角色编码', dataIndex: 'code', key: 'code' },
      { title: '描述', dataIndex: 'description', key: 'description', render: (value: string) => value || '-' },
      {
        title: '权限',
        dataIndex: 'permissions',
        key: 'permissions',
        render: (items: string[]) => (
          <Space wrap>
            {items.length === 0 ? <Tag>无权限</Tag> : items.map((item) => <Tag key={item}>{item}</Tag>)}
          </Space>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value: number) => (value === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>),
      },
    ],
    [],
  );

  async function loadData() {
    setLoading(true);
    try {
      const [roleList, permissionList] = await Promise.all([roleService.list(), roleService.listPermissions()]);
      setRoles(roleList);
      setPermissions(permissionList);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(values: CreateRolePayload) {
    await roleService.create(values);
    message.success('角色已创建');
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
        <Typography.Title level={2} style={{ marginBottom: 8 }}>角色管理</Typography.Title>
        <Typography.Text type="secondary">已经接上角色列表、权限列表和新增角色操作。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增角色</Button>
          </Space>
        }
      >
        <Table rowKey="id" loading={loading} columns={columns} dataSource={roles} pagination={false} />
      </Card>

      <Modal title="新增角色" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnHidden>
        <Form layout="vertical" form={form} onFinish={handleCreate}>
          <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="角色编码" name="code" rules={[{ required: true, message: '请输入角色编码' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="权限" name="permissionIds">
            <Checkbox.Group
              options={permissions.map((item) => ({ label: `${item.name} (${item.code})`, value: item.id }))}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>保存角色</Button>
        </Form>
      </Modal>
    </Space>
  );
}
