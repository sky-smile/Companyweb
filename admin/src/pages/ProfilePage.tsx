import { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, Space, Typography } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { authStore } from '../stores/auth-store';
import { AuthProfile } from '../types/auth';
import { adminUserService } from '../services/admin-user-service';
import { useMessage } from '../hooks/useMessage';

export function ProfilePage() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const message = useMessage();

  useEffect(() => {
    const currentProfile = authStore.getProfile();
    setProfile(currentProfile);
    if (currentProfile) {
      form.setFieldsValue({
        username: currentProfile.username,
        nickname: currentProfile.nickname,
        roles: currentProfile.roles.join(', '),
        permissions: currentProfile.permissions.length > 0 ? currentProfile.permissions.join(', ') : '继承自角色',
      });
    }
  }, [form]);

  async function handleSave() {
    const values = form.getFieldsValue();
    setSaving(true);
    try {
      const updatedProfile = await adminUserService.updateProfile({
        nickname: values.nickname,
      });
      authStore.setProfile(updatedProfile);
      setProfile(updatedProfile);
      message.success('个人资料已更新');
      setEditing(false);
    } catch (error) {
      message.error('保存失败，请重试');
      console.error('Save profile error:', error);
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <Typography.Text type="secondary">无法加载用户信息</Typography.Text>
    );
  }

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>个人资料</Typography.Title>
        <Typography.Text type="secondary">查看和编辑您的个人信息。</Typography.Text>
      </div>

      <Card
        extra={
          !editing ? (
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              编辑
            </Button>
          ) : (
            <Space>
              <Button onClick={() => { setEditing(false); form.resetFields(); }}>
                取消
              </Button>
              <Button
                icon={<SaveOutlined />}
                type="primary"
                onClick={handleSave}
                loading={saving}
              >
                保存
              </Button>
            </Space>
          )
        }
      >
        <Form form={form} layout="vertical">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="用户名" span={1}>
              <Form.Item name="username" style={{ margin: 0 }}>
                <Input disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="昵称" span={1}>
              <Form.Item name="nickname" style={{ margin: 0 }}>
                <Input disabled={!editing} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="超级管理员" span={1}>
              {profile.isSuperAdmin ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="角色" span={1}>
              <Form.Item name="roles" style={{ margin: 0 }}>
                <Input disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="权限" span={2}>
              <Form.Item name="permissions" style={{ margin: 0 }}>
                <Input.TextArea rows={2} disabled />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </Card>
    </Space>
  );
}
