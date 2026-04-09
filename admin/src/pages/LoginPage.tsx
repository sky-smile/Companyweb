import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth-service';
import { authStore } from '../stores/auth-store';
import { LoginPayload } from '../types/auth';

export function LoginPage() {
  const navigate = useNavigate();

  async function handleSubmit(values: LoginPayload) {
    const result = await authService.login(values);
    authStore.setSession(result);
    message.success(`欢迎回来，${result.profile.nickname || result.profile.username}`);
    navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <Card style={{ width: 420, borderRadius: 24, boxShadow: '0 24px 72px rgba(16, 40, 80, 0.14)' }}>
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={2} style={{ marginBottom: 8 }}>
              公司后台管理
            </Typography.Title>
            <Typography.Text type="secondary">
              使用管理员账号登录，继续维护新闻、公告、产品和站点内容。
            </Typography.Text>
          </div>

          <Form<LoginPayload>
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ username: 'admin', password: 'Admin123456' }}
          >
            <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined />} size="large" placeholder="请输入管理员用户名" />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} size="large" placeholder="请输入密码" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录后台
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
