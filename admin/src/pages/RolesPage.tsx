import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Popconfirm, Space, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { StatusSwitch } from '../components/common';
import { CrudPage } from '../components/CrudPage';
import { roleService } from '../services/role-service';
import { CreateRolePayload, PermissionItem, RoleItem, UpdateRolePayload } from '../types/role';
import { PERMISSION_GROUPS, getPermissionName } from '../config/permissions';
import { useMessage } from '../hooks/useMessage';

export function RolesPage() {
  const [form] = Form.useForm<CreateRolePayload & UpdateRolePayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const message = useMessage();

  const columns = useMemo(
    () => [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        render: (value: string, record: RoleItem) => (
          <Space>
            <TeamOutlined style={{ color: '#722ed1' }} />
            <strong>{value}</strong>
            {record.code === 'super-admin' && <Tag color="purple">超级管理员</Tag>}
          </Space>
        ),
      },
      {
        title: '角色编码',
        dataIndex: 'code',
        key: 'code',
        width: 150,
        render: (value: string) => <Tag color="blue">{value}</Tag>,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        render: (value: string) => value || '-',
      },
      {
        title: '权限数量',
        dataIndex: 'permissions',
        key: 'permissions',
        width: 100,
        render: (items: string[]) => <Tag color="green">{items.length} 个</Tag>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (value: number, record: RoleItem) => (
          <StatusSwitch
            value={value}
            disabled={record.code === 'super-admin'}
            onChange={async (newValue) => {
              await roleService.updateStatus(record.id, newValue);
              message.success(newValue === 1 ? '角色已启用' : '角色已禁用');
              void loadData();
            }}
          />
        ),
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (_: unknown, record: RoleItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              disabled={record.code === 'super-admin'}
              onClick={() => {
                setEditingRole(record);
                // 将权限代码转换为权限 ID
                const permissionIds = record.permissions
                  .map((code: string) => permissions.find((p) => p.code === code)?.id)
                  .filter((id): id is string => id !== undefined);
                form.setFieldsValue({
                  name: record.name,
                  code: record.code,
                  description: record.description,
                  permissionIds,
                  status: record.status,
                });
                setModalOpen(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除这个角色吗？"
              description="删除后无法恢复"
              onConfirm={async () => {
                message.info('删除功能待后端支持');
                void loadData();
              }}
            >
              <Button danger icon={<DeleteOutlined />} size="small" disabled={record.code === 'super-admin'}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [form],
  );

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchSearch = searchText
        ? role.name.toLowerCase().includes(searchText.toLowerCase()) ||
          role.code.toLowerCase().includes(searchText.toLowerCase()) ||
          (role.description && role.description.toLowerCase().includes(searchText.toLowerCase()))
        : true;
      const matchStatus = filterStatus !== undefined ? role.status === filterStatus : true;
      return matchSearch && matchStatus;
    });
  }, [roles, searchText, filterStatus]);

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

  function handleOpenCreate() {
    setEditingRole(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, permissionIds: [] });
    setModalOpen(true);
  }

  async function handleSave() {
    // 只提取后端 DTO 接受的字段
    const rawValues = form.getFieldsValue();
    const permissionIds: string[] = Array.isArray(rawValues.permissionIds) ? rawValues.permissionIds : [];

    if (editingRole) {
      // UpdateRoleDto 只接受: name, description, permissionIds
      const payload: UpdateRolePayload = {
        name: rawValues.name,
        description: rawValues.description,
        permissionIds,
      };
      await roleService.update(editingRole.id, payload);
      message.success('角色已更新');
    } else {
      // CreateRoleDto 需要: name, code, 可选: description, permissionIds
      const payload: CreateRolePayload = {
        name: rawValues.name,
        code: rawValues.code,
        description: rawValues.description,
        permissionIds,
      };
      await roleService.create(payload);
      message.success('角色已创建');
    }

    setModalOpen(false);
    setEditingRole(null);
    form.resetFields();
    void loadData();
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <>
      <CrudPage
        title="角色管理"
        description="管理角色和权限分配，支持按组选择权限。"
        columns={columns}
        dataSource={filteredRoles}
        loading={loading}
        search={{ placeholder: '搜索角色名称、编码或描述', value: searchText, onChange: setSearchText }}
        filter={{
          placeholder: '筛选状态',
          value: filterStatus,
          onChange: (val) => setFilterStatus(val as number | undefined),
          options: [
            { label: '已启用', value: 1 },
            { label: '已禁用', value: 0 },
          ],
        }}
        onRefresh={() => void loadData()}
        onCreate={{ label: '新增角色', onClick: handleOpenCreate }}
      />

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingRole(null);
        }}
        footer={null}
        destroyOnHidden
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleSave} initialValues={{ status: 1, permissionIds: [] }}>
          <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="如：内容编辑员" disabled={editingRole?.code === 'super-admin'} />
          </Form.Item>
          <Form.Item label="角色编码" name="code" rules={[{ required: true, message: '请输入角色编码' }]}>
            <Input placeholder="如：content-editor" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={2} placeholder="角色职责描述" />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="value" getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}>
            <StatusSwitch checkedLabel="启用" uncheckedLabel="禁用" />
          </Form.Item>

          <Form.Item label="权限分配" name="permissionIds" tooltip="按功能模块选择权限" initialValue={[]}>
            <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16, background: '#fafafa' }}>
              <Form.Item noStyle shouldUpdate>
                {() => {
                  const currentIds: string[] = form.getFieldValue('permissionIds') || [];
                  return (
                    <>
                      {PERMISSION_GROUPS.map((group) => {
                        const groupPerms = permissions.filter((p) => p.code.startsWith(group.key));
                        if (groupPerms.length === 0) return null;
                        const allGroupIds = groupPerms.map((p) => p.id);
                        const allSelected = allGroupIds.length > 0 && allGroupIds.every((id) => currentIds.includes(id));

                        return (
                          <div key={group.key} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                            <Space style={{ marginBottom: 8 }}>
                              <Typography.Text strong style={{ color: 'var(--color-text-secondary)' }}>
                                {group.title}
                              </Typography.Text>
                              <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                  if (allSelected) {
                                    form.setFieldValue('permissionIds', currentIds.filter((id: string) => !allGroupIds.includes(id)));
                                  } else {
                                    form.setFieldValue('permissionIds', [...new Set([...currentIds, ...allGroupIds])]);
                                  }
                                }}
                              >
                                {allSelected ? '取消全选' : '全选'}
                              </Button>
                            </Space>
                            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                              {groupPerms.map((perm) => (
                                <Checkbox
                                  key={perm.id}
                                  checked={currentIds.includes(perm.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      form.setFieldValue('permissionIds', [...new Set([...currentIds, perm.id])]);
                                    } else {
                                      form.setFieldValue('permissionIds', currentIds.filter((id: string) => id !== perm.id));
                                    }
                                  }}
                                >
                                  <Space>
                                    <Typography.Text>{getPermissionName(perm.code)}</Typography.Text>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>({perm.code})</Typography.Text>
                                  </Space>
                                </Checkbox>
                              ))}
                            </Space>
                          </div>
                        );
                      })}
                      {permissions.length === 0 && (
                        <Typography.Text type="secondary">加载中...</Typography.Text>
                      )}
                      {permissions.length > 0 && PERMISSION_GROUPS.every((group) => {
                        return permissions.filter((p) => p.code.startsWith(group.key)).length === 0;
                      }) && (
                        <Typography.Text type="secondary">暂无权限数据</Typography.Text>
                      )}
                    </>
                  );
                }}
              </Form.Item>
            </div>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editingRole ? '更新角色' : '创建角色'}
          </Button>
        </Form>
      </Modal>
    </>
  );
}
