import { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd';
import { LockOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth-service';
import { authStore } from '../stores/auth-store';
import { LoginPayload } from '../types/auth';
import { useMessage } from '../hooks/useMessage';
import { getErrorMessage } from '../lib/error-utils';

const { Title, Text, Link } = Typography;

// 记住密码的本地存储键
const REMEMBER_ME_KEY = 'admin_remember_me';
const REMEMBERED_USERNAME = 'admin_remembered_username';

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const message = useMessage();

  // 页面加载时恢复记住的用户名
  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBERED_USERNAME);
    const shouldRemember = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    if (remembered && shouldRemember) {
      form.setFieldsValue({ username: remembered, remember: true });
    }
  }, [form]);

  async function handleSubmit(values: LoginPayload & { remember?: boolean }) {
    setLoading(true);
    try {
      const { remember, ...loginData } = values;
      
      // 处理记住密码
      if (remember) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
        localStorage.setItem(REMEMBERED_USERNAME, values.username);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(REMEMBERED_USERNAME);
      }

      const result = await authService.login(loginData);
      authStore.setSession(result);
      message.success(`欢迎回来，${result.profile.nickname || result.profile.username}`);
      navigate('/');
    } catch (error) {
      message.error(getErrorMessage(error, '登录失败，请检查用户名和密码'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        filter: 'blur(40px)',
      }} />

      {/* 登录卡片 */}
      <Card 
        style={{ 
          width: 440, 
          maxWidth: '100%',
          borderRadius: 16, 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeInUp 0.6s ease-out',
        }}
        styles={{
          body: { padding: '32px 24px' }
        }}
      >
        <Space orientation="vertical" size={28} style={{ width: '100%' }}>
          {/* Logo 和标题 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            }}>
              <SafetyOutlined style={{ fontSize: 32, color: '#fff' }} />
            </div>
            <Title level={3} style={{ marginBottom: 8, color: '#1f1f1f' }}>
              公司后台管理
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              使用管理员账号登录系统，管理网站内容
            </Text>
          </div>

          {/* 登录表单 */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
            requiredMark={false}
            size="large"
          >
            <Form.Item 
              label="用户名" 
              name="username" 
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少 3 个字符' },
              ]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="请输入管理员用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item 
              label="密码" 
              name="password" 
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少 6 个字符' },
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Link 
                  onClick={() => message.info('请联系系统管理员重置密码')}
                  style={{ fontSize: 14 }}
                >
                  忘记密码？
                </Link>
              </div>
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loading}
              style={{ 
                height: 44,
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              {loading ? '登录中...' : '登 录'}
            </Button>
          </Form>

          {/* 底部提示 */}
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              如遇问题，请联系系统管理员获取帮助
            </Text>
          </div>
        </Space>
      </Card>

      {/* 动画样式 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
