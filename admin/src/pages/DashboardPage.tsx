import { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  BellOutlined,
  FileTextOutlined,
  PictureOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { announcementService } from '../services/announcement-service';
import { newsService } from '../services/news-service';
import { productService } from '../services/product-service';
import { unwrapResponse, http } from '../services/http';
import type { AdminUserListResult } from '../types/admin-user';
import { authStore } from '../stores/auth-store';

const quickLinks = [
  { title: '账号管理', description: '维护管理员与角色权限', route: '/account/admin-users', icon: <TeamOutlined />, color: '#1890ff', permission: 'admin-users:view' },
  { title: '新闻管理', description: '发布新闻、管理分类', route: '/content/news', icon: <FileTextOutlined />, color: '#52c41a', permission: 'news:view' },
  { title: '公告管理', description: '维护公告与置顶状态', route: '/content/announcements', icon: <BellOutlined />, color: '#faad14', permission: 'announcement:view' },
  { title: '产品管理', description: '维护产品分类和详情', route: '/content/products', icon: <AppstoreOutlined />, color: '#722ed1', permission: 'product:view' },
  { title: '站点内容', description: '首页、关于我们、联系我们', route: '/site/pages', icon: <SettingOutlined />, color: '#13c2c2', permission: 'site-page:view' },
  { title: '媒体中心', description: '上传图片和文件资源', route: '/media/upload', icon: <PictureOutlined />, color: '#eb2f96', permission: 'upload:image' },
];

interface DashboardStats {
  newsCount: number;
  announcementCount: number;
  productCount: number;
  adminCount: number;
}

interface RecentActivity {
  id: string;
  type: 'news' | 'announcement' | 'product';
  title: string;
  status: string;
  createdAt: string;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    newsCount: 0,
    announcementCount: 0,
    productCount: 0,
    adminCount: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // 仅请求有权限的模块，避免无权限 403
        const stats: DashboardStats = { newsCount: 0, announcementCount: 0, productCount: 0, adminCount: 0 };
        const activities: RecentActivity[] = [];

        if (authStore.hasPermission('news:view')) {
          try { const r = await newsService.list({ pageSize: 1000 }); stats.newsCount = r.list.length; r.list.slice(0, 3).forEach((item) => activities.push({ id: `news-${item.id}`, type: 'news', title: item.title, status: item.status === 1 ? '已发布' : '草稿', createdAt: '最近更新' })); } catch { /* ignore */ }
        }
        if (authStore.hasPermission('announcement:view')) {
          try { const r = await announcementService.list({ pageSize: 1000 }); stats.announcementCount = r.list.length; r.list.slice(0, 3).forEach((item) => activities.push({ id: `ann-${item.id}`, type: 'announcement', title: item.title, status: item.status === 1 ? '已发布' : '草稿', createdAt: '最近更新' })); } catch { /* ignore */ }
        }
        if (authStore.hasPermission('product:view')) {
          try { const r = await productService.list({ pageSize: 1000 }); stats.productCount = r.list.length; r.list.slice(0, 2).forEach((item) => activities.push({ id: `prd-${item.id}`, type: 'product', title: item.name, status: item.status === 1 ? '已发布' : '草稿', createdAt: '最近更新' })); } catch { /* ignore */ }
        }
        if (authStore.hasPermission('admin-users:view')) {
          try {
            const r = await http.get('/admin-users', { params: { pageSize: 1000 } } as Record<string, unknown>).then((res) => unwrapResponse<AdminUserListResult>(res));
            stats.adminCount = r.list.length;
          } catch { /* ignore */ }
        }

        setStats(stats);
        setRecentActivities(activities.sort(() => Math.random() - 0.5).slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    void loadDashboardData();
  }, []);

  const activityColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const config = {
          news: { color: 'green', label: '新闻' },
          announcement: { color: 'orange', label: '公告' },
          product: { color: 'purple', label: '产品' },
        };
        const { color, label } = config[type as keyof typeof config];
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
    },
  ];

  return (
    <Space orientation="vertical" size={24} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          控制台
        </Typography.Title>
        <Typography.Text type="secondary">
          欢迎使用后台管理系统，查看系统概览和快捷操作。
        </Typography.Text>
      </div>

      {/* 统计卡片 — 仅显示有权限的模块 */}
      <Row gutter={[16, 16]}>
        {authStore.hasPermission('news:view') && (
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="新闻总数"
                value={stats.newsCount}
                prefix={<FileTextOutlined />}
                styles={{ content: { color: '#52c41a' } }}
              />
            </Card>
          </Col>
        )}
        {authStore.hasPermission('announcement:view') && (
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="公告总数"
                value={stats.announcementCount}
                prefix={<BellOutlined />}
                styles={{ content: { color: '#faad14' } }}
              />
            </Card>
          </Col>
        )}
        {authStore.hasPermission('product:view') && (
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="产品总数"
                value={stats.productCount}
                prefix={<AppstoreOutlined />}
                styles={{ content: { color: '#722ed1' } }}
              />
            </Card>
          </Col>
        )}
        {authStore.hasPermission('admin-users:view') && (
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="管理员数"
                value={stats.adminCount}
                prefix={<TeamOutlined />}
                styles={{ content: { color: '#1890ff' } }}
              />
            </Card>
          </Col>
        )}
      </Row>

      {/* 快捷入口 — 仅显示有权限的模块 */}
      {(() => {
        const visibleLinks = quickLinks.filter((item) => authStore.hasPermission(item.permission));
        if (visibleLinks.length === 0) return null;
        return (
          <div>
            <Typography.Title level={4} style={{ marginBottom: 16 }}>快捷入口</Typography.Title>
            <Row gutter={[16, 16]}>
              {visibleLinks.map((item) => (
                <Col xs={24} sm={12} lg={8} xl={4} key={item.route}>
                  <Link to={item.route} style={{ display: 'block' }}>
                    <Card
                      hoverable
                      style={{
                        height: '100%',
                        textAlign: 'center',
                        borderColor: item.color,
                      }}
                    >
                      <Space orientation="vertical" size={8} style={{ display: 'flex' }}>
                        <div style={{ fontSize: 32, color: item.color }}>{item.icon}</div>
                        <Typography.Text strong style={{ fontSize: 16 }}>{item.title}</Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          {item.description}
                        </Typography.Text>
                      </Space>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        );
      })()}

      {/* 最近活动 */}
      <Card title="最近活动" loading={loading}>
        {recentActivities.length > 0 ? (
          <Table
            rowKey="id"
            dataSource={recentActivities}
            columns={activityColumns}
            pagination={false}
            size="small"
          />
        ) : (
          <Typography.Text type="secondary">暂无活动数据</Typography.Text>
        )}
      </Card>

      {/* 系统信息 */}
      <Card title="系统信息">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Space orientation="vertical" size={8}>
              <Typography.Text strong>运行环境</Typography.Text>
              <Typography.Text type="secondary">MariaDB + NestJS + React</Typography.Text>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space orientation="vertical" size={8}>
              <Typography.Text strong>认证方式</Typography.Text>
              <Typography.Text type="secondary">JWT Token + RBAC 权限</Typography.Text>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space orientation="vertical" size={8}>
              <Typography.Text strong>前端技术</Typography.Text>
              <Typography.Text type="secondary">Vite + React 19 + Ant Design 6</Typography.Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}
