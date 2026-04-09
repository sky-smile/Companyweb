import {
  AppstoreOutlined,
  FileTextOutlined,
  NotificationOutlined,
  PictureOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import { Link } from 'react-router-dom';

const quickLinks = [
  { title: '账号管理', description: '维护管理员与角色权限', route: '/account/admin-users', icon: <TeamOutlined /> },
  { title: '新闻管理', description: '发布新闻、管理分类', route: '/content/news', icon: <FileTextOutlined /> },
  { title: '公告管理', description: '维护公告与置顶状态', route: '/content/announcements', icon: <NotificationOutlined /> },
  { title: '产品管理', description: '维护产品分类和详情', route: '/content/products', icon: <AppstoreOutlined /> },
  { title: '站点内容', description: '首页、关于我们、联系我们', route: '/site/pages', icon: <SettingOutlined /> },
  { title: '媒体中心', description: '上传图片和文件资源', route: '/media/upload', icon: <PictureOutlined /> },
];

export function DashboardPage() {
  return (
    <Space orientation="vertical" size={24} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          控制台
        </Typography.Title>
        <Typography.Text type="secondary">
          当前后台已经接通认证、权限、新闻、公告、产品、站点内容和上传接口，可以开始逐步补管理页面。
        </Typography.Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><Card><Statistic title="已接通模块" value={7} suffix="个" /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="后台能力" value="RBAC + JWT" /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="当前环境" value="MariaDB / Vite" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        {quickLinks.map((item) => (
          <Col xs={24} md={12} xl={8} key={item.route}>
            <Link to={item.route} style={{ display: 'block' }}>
              <Card hoverable style={{ height: '100%' }}>
                <Space orientation="vertical" size={8}>
                  <Typography.Text style={{ fontSize: 20 }}>{item.icon}</Typography.Text>
                  <Typography.Title level={4} style={{ margin: 0 }}>{item.title}</Typography.Title>
                  <Typography.Text type="secondary">{item.description}</Typography.Text>
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
