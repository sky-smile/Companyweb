import { Form, Input, Button, Card, Space, Typography, message } from 'antd';
import { LockOutlined, SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { authStore } from '../stores/auth-store';
import { http } from '../services/http';

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function SettingsPage() {
  const [form] = Form.useForm<ChangePasswordPayload>();
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(values: ChangePasswordPayload) {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await http.post('/auth/change-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success('密码已修改，请重新登录');
      authStore.clearSession();
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (error: any) {
      message.error(error.response?.data?.message || '修改密码失败，请重试');
      console.error('Change password error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>账号设置</Typography.Title>
        <Typography.Text type="secondary">修改密码和账号安全设置。</Typography.Text>
      </div>

      <Card title="修改密码">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ maxWidth: 480 }}
        >
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入当前密码"
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少 8 个字符' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码（至少 8 个字符）"
            />
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
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="账号信息">
        <Typography.Paragraph>
          <Typography.Text strong>用户名：</Typography.Text>
          {authStore.getProfile()?.username || '-'}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>角色：</Typography.Text>
          {authStore.getProfile()?.roles.join(', ') || '未分配'}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text strong>超级管理员：</Typography.Text>
          {authStore.getProfile()?.isSuperAdmin ? '是' : '否'}
        </Typography.Paragraph>
      </Card>
    </Space>
  );
}
