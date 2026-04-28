import { useState } from 'react';
import {
  AppstoreOutlined,
  BellOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  PictureOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Menu, Space, Tooltip, Typography } from 'antd';
import type { BreadcrumbProps, MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '../stores/auth-store';
import { authService } from '../services/auth-service';

const { Header, Sider, Content } = Layout;

// 菜单配置
interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  permission?: string;
}

const menuGroups: { title: string; items: MenuItem[] }[] = [
  {
    title: '主导航',
    items: [
      { key: '/', icon: <DashboardOutlined />, label: '控制台' },
    ],
  },
  {
    title: '系统管理',
    items: [
      { key: '/account/admin-users', icon: <UserOutlined />, label: '账号管理', permission: 'admin-users:view' },
      { key: '/account/roles', icon: <TeamOutlined />, label: '角色管理', permission: 'roles:view' },
    ],
  },
  {
    title: '内容管理',
    items: [
      { key: '/content/news', icon: <FileTextOutlined />, label: '新闻管理', permission: 'news:view' },
      { key: '/content/announcements', icon: <BellOutlined />, label: '公告管理', permission: 'announcement:view' },
      { key: '/content/products', icon: <AppstoreOutlined />, label: '产品管理', permission: 'product:view' },
    ],
  },
  {
    title: '站点配置',
    items: [
      { key: '/site/pages', icon: <SettingOutlined />, label: '页面内容', permission: 'site-page:view' },
      { key: '/site/banners', icon: <PictureOutlined />, label: 'Banner 管理', permission: 'banner:view' },
      { key: '/site/settings', icon: <AppstoreOutlined />, label: '站点设置', permission: 'site-setting:view' },
      { key: '/media/upload', icon: <NotificationOutlined />, label: '媒体中心', permission: 'upload:image' },
    ],
  },
];

// 路由标题映射
const routeTitles: Record<string, string> = {
  '/': '控制台',
  '/account/admin-users': '账号管理',
  '/account/roles': '角色管理',
  '/account/profile': '个人资料',
  '/account/settings': '账号设置',
  '/content/news': '新闻管理',
  '/content/announcements': '公告管理',
  '/content/products': '产品管理',
  '/site/pages': '页面内容',
  '/site/banners': 'Banner 管理',
  '/site/settings': '站点设置',
  '/media/upload': '媒体中心',
};

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const profile = authStore.getProfile();

  // 根据权限过滤菜单
  const filterMenuByPermission = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item) => {
      if (!item.permission) return true;
      return authStore.hasPermission(item.permission);
    });
  };

  // 构建 Ant Design Menu items
  const buildMenuItems = (): NonNullable<MenuProps['items']> => {
    return menuGroups.map((group, index) => ({
      key: `group-${index}`,
      type: 'group' as const,
      label: group.title,
      children: filterMenuByPermission(group.items).map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
      })),
    }));
  };

  // 生成面包屑
  const generateBreadcrumbs = (): NonNullable<BreadcrumbProps['items']> => {
    const path = location.pathname;
    if (path === '/') {
      return [{ title: <HomeOutlined /> }, { title: '控制台' }];
    }

    const parts = path.split('/').filter(Boolean);
    const breadcrumbs: NonNullable<BreadcrumbProps['items']> = [{ title: <HomeOutlined />, href: '/' }];

    let currentPath = '';
    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      const title = routeTitles[currentPath] || part;
      const isLast = index === parts.length - 1;

      breadcrumbs.push({
        title,
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  // 切换全屏
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/account/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
      onClick: () => navigate('/account/settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: async () => {
        await authService.logout().catch(() => undefined);
        authStore.clearSession();
        navigate('/login');
      },
    },
  ];

  const currentPageTitle = routeTitles[location.pathname] || '未知页面';

  // 获取用户显示名称
  const getDisplayName = (): string => {
    if (!profile) return '用户';
    return profile.nickname || profile.username || '用户';
  };

  // 获取用户头像字母
  const getAvatarLetter = (): string => {
    if (!profile) return 'U';
    const name = profile.nickname || profile.username || 'U';
    return name.slice(0, 1).toUpperCase();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        width={260}
        collapsed={collapsed}
        collapsedWidth={80}
        theme="light"
        style={{
          borderRight: '1px solid #f0f0f0',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo 区域 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid var(--color-border)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          />
          
          {collapsed ? (
            <div style={{ position: 'relative', zIndex: 1 }}>
              <DashboardOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
          ) : (
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Typography.Title level={4} style={{ margin: 0, fontSize: 18, color: '#fff', fontWeight: 700 }}>
                Company Admin
              </Typography.Title>
              <Typography.Text style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.8)' }}>
                内容管理控制台
              </Typography.Text>
            </div>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={buildMenuItems()}
          onClick={({ key }) => navigate(key)}
          style={{
            borderInlineEnd: 'none',
            marginTop: 8,
            background: 'transparent',
            padding: '8px 0',
          }}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
        {/* 顶栏 */}
        <Header
          style={{
            background: 'var(--color-bg-container)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* 左侧：折叠按钮 + 面包屑 + 页面标题 */}
          <Space size={16}>
            <Tooltip title={collapsed ? '展开侧边栏' : '折叠侧边栏'}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: 16,
                  borderRadius: 'var(--radius-md)',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Tooltip>

            <Breadcrumb
              items={generateBreadcrumbs()}
              separator=">"
              style={{ fontSize: 14 }}
            />

            <Typography.Title
              level={4}
              style={{
                margin: 0,
                fontSize: 18,
                color: 'var(--color-text-primary)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {currentPageTitle}
            </Typography.Title>
          </Space>

          {/* 右侧：全屏切换 + 用户信息 */}
          <Space size={12}>
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏模式'}>
              <Button
                type="text"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Tooltip>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-bg-layout)',
                  transition: 'all var(--transition-fast)',
                  border: '1px solid var(--color-border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-bg-layout)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Avatar
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  }}
                  icon={<UserOutlined />}
                >
                  {getAvatarLetter()}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.4 }}>
                  <Typography.Text style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>
                    {getDisplayName()}
                  </Typography.Text>
                  {profile?.isSuperAdmin && (
                    <Typography.Text style={{ fontSize: 11, margin: 0, color: '#722ed1' }}>
                      👑 超级管理员
                    </Typography.Text>
                  )}
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: '#f5f5f5',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
