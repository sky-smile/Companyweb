import {
  AppstoreOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  NotificationOutlined,
  PictureOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '../stores/auth-store';

const { Header, Sider, Content } = Layout;

const menuItems: NonNullable<MenuProps['items']> = [
  { key: '/', icon: <HomeOutlined />, label: '控制台' },
  { key: '/account/admin-users', icon: <TeamOutlined />, label: '账号管理' },
  { key: '/account/roles', icon: <TeamOutlined />, label: '角色管理' },
  { key: '/content/news', icon: <FileTextOutlined />, label: '新闻管理' },
  { key: '/content/announcements', icon: <NotificationOutlined />, label: '公告管理' },
  { key: '/content/products', icon: <AppstoreOutlined />, label: '产品管理' },
  { key: '/site/pages', icon: <SettingOutlined />, label: '页面内容' },
  { key: '/site/banners', icon: <PictureOutlined />, label: 'Banner 管理' },
  { key: '/site/settings', icon: <SettingOutlined />, label: '站点设置' },
  { key: '/media/upload', icon: <PictureOutlined />, label: '媒体中心' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = authStore.getProfile();
  const visibleMenuItems = menuItems.filter((item) => {
    if (typeof item?.key !== 'string') {
      return true;
    }

    const permissionMap: Record<string, string | undefined> = {
      '/account/admin-users': 'admin-users:view',
      '/account/roles': 'roles:view',
      '/content/news': 'news:view',
      '/content/announcements': 'announcement:view',
      '/content/products': 'product:view',
      '/site/pages': 'site-page:view',
      '/site/banners': 'banner:view',
      '/site/settings': 'site-setting:view',
      '/media/upload': 'upload:image',
    };

    return authStore.hasPermission(permissionMap[item.key]);
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="light" style={{ borderRight: '1px solid #e7edf6' }}>
        <div style={{ padding: 24 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>Company Admin</Typography.Title>
          <Typography.Text type="secondary">内容管理控制台</Typography.Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={visibleMenuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderInlineEnd: 'none' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: 'rgba(255,255,255,0.8)',
            borderBottom: '1px solid #e7edf6',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {profile?.nickname || profile?.username || '管理员'}
            </Typography.Title>
            <Typography.Text type="secondary">权限已接入，页面可逐步联调后端模块。</Typography.Text>
          </div>
          <Space>
            <Avatar style={{ backgroundColor: '#1f5eff' }}>{(profile?.username || 'A').slice(0, 1).toUpperCase()}</Avatar>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                authStore.clearSession();
                void fetch('/').catch(() => undefined);
                navigate('/login');
              }}
            >
              退出登录
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
