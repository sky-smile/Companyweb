import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Table, Tabs, Tag, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { siteContentService } from '../services/site-content-service';
import { BannerItem, CreateBannerPayload, SitePageItem, SiteSettingItem, UpdateSiteSettingsPayload } from '../types/site-content';

export function SiteContentPage() {
  const [pageForm] = Form.useForm<SitePageItem>();
  const [settingsForm] = Form.useForm<UpdateSiteSettingsPayload>();
  const [bannerForm] = Form.useForm<CreateBannerPayload>();
  const [loading, setLoading] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentPageKey, setCurrentPageKey] = useState('home');

  async function loadPage(pageKey: string) {
    const page = await siteContentService.getSitePage(pageKey);
    pageForm.setFieldsValue(page);
  }

  async function loadSettings() {
    const settings = await siteContentService.listSiteSettings();
    settingsForm.setFieldsValue({ items: settings.length > 0 ? settings : [{ settingKey: 'companyName', settingValue: '', settingGroup: 'company', description: '公司名称' }] });
  }

  async function loadBanners() {
    const result = await siteContentService.listBanners();
    setBanners(result);
  }

  async function loadData(pageKey = currentPageKey) {
    setLoading(true);
    try {
      await Promise.all([loadPage(pageKey), loadSettings(), loadBanners()]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePage(values: SitePageItem) {
    await siteContentService.updateSitePage(currentPageKey, values);
    message.success('页面内容已保存');
    void loadPage(currentPageKey);
  }

  async function handleSaveSettings(values: UpdateSiteSettingsPayload) {
    await siteContentService.updateSiteSettings(values);
    message.success('站点设置已保存');
    void loadSettings();
  }

  async function handleCreateBanner(values: CreateBannerPayload) {
    await siteContentService.createBanner(values);
    message.success('Banner 已创建');
    setBannerModalOpen(false);
    bannerForm.resetFields();
    void loadBanners();
  }

  useEffect(() => {
    void loadData('home');
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>站点内容</Typography.Title>
        <Typography.Text type="secondary">当前已接上页面内容、站点设置和 Banner 列表，可继续扩展富文本编辑和图片上传回填。</Typography.Text>
      </div>

      <Tabs
        onChange={(key) => {
          if (key === 'home' || key === 'about' || key === 'contact') {
            setCurrentPageKey(key);
            void loadPage(key);
          }
        }}
        items={[
          {
            key: 'home',
            label: '首页内容',
            children: (
              <Card extra={<Button icon={<SaveOutlined />} type="primary" onClick={() => void pageForm.submit()}>保存页面</Button>}>
                <Form layout="vertical" form={pageForm} onFinish={handleSavePage}>
                  <Form.Item label="标题" name="title"><Input /></Form.Item>
                  <Form.Item label="正文" name="content"><Input.TextArea rows={8} /></Form.Item>
                  <Form.Item label="附加 JSON" name="extraJson"><Input.TextArea rows={4} /></Form.Item>
                  <Form.Item label="SEO 标题" name="seoTitle"><Input /></Form.Item>
                  <Form.Item label="SEO 描述" name="seoDescription"><Input.TextArea rows={3} /></Form.Item>
                  <Form.Item label="状态" name="status"><Input type="number" /></Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'about',
            label: '关于我们',
            children: <Card><Typography.Text type="secondary">切换到此标签后会自动加载 `about` 页面内容，点击保存仍写回同一表。</Typography.Text></Card>,
          },
          {
            key: 'contact',
            label: '联系我们',
            children: <Card><Typography.Text type="secondary">切换到此标签后会自动加载 `contact` 页面内容，点击保存仍写回同一表。</Typography.Text></Card>,
          },
          {
            key: 'settings',
            label: '站点设置',
            children: (
              <Card extra={<Button icon={<SaveOutlined />} type="primary" onClick={() => void settingsForm.submit()}>保存设置</Button>}>
                <Form layout="vertical" form={settingsForm} onFinish={handleSaveSettings}>
                  <Form.List name="items">
                    {(fields) => (
                      <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
                        {fields.map((field) => (
                          <Card key={field.key} size="small">
                            <Form.Item label="键名" name={[field.name, 'settingKey']}><Input /></Form.Item>
                            <Form.Item label="值" name={[field.name, 'settingValue']}><Input.TextArea rows={2} /></Form.Item>
                            <Form.Item label="分组" name={[field.name, 'settingGroup']}><Input /></Form.Item>
                            <Form.Item label="说明" name={[field.name, 'description']}><Input /></Form.Item>
                          </Card>
                        ))}
                      </Space>
                    )}
                  </Form.List>
                </Form>
              </Card>
            ),
          },
          {
            key: 'banners',
            label: 'Banner 管理',
            children: (
              <Card
                extra={
                  <Space>
                    <Button icon={<ReloadOutlined />} onClick={() => void loadBanners()}>刷新</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setBannerModalOpen(true)}>新增 Banner</Button>
                  </Space>
                }
              >
                <Table
                  rowKey="id"
                  loading={loading}
                  dataSource={banners}
                  pagination={false}
                  columns={[
                    { title: '标题', dataIndex: 'title', key: 'title' },
                    { title: '副标题', dataIndex: 'subtitle', key: 'subtitle', render: (value: string) => value || '-' },
                    { title: '图片', dataIndex: 'imageUrl', key: 'imageUrl' },
                    { title: '链接', dataIndex: 'linkUrl', key: 'linkUrl', render: (value: string) => value || '-' },
                    { title: '排序', dataIndex: 'sort', key: 'sort' },
                    { title: '状态', dataIndex: 'status', key: 'status', render: (value: number) => (value === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>) },
                  ]}
                />
              </Card>
            ),
          },
        ]}
      />

      <Modal title="新增 Banner" open={bannerModalOpen} onCancel={() => setBannerModalOpen(false)} footer={null} destroyOnHidden>
        <Form layout="vertical" form={bannerForm} onFinish={handleCreateBanner} initialValues={{ sort: 0 }}>
          <Form.Item label="标题" name="title"><Input /></Form.Item>
          <Form.Item label="副标题" name="subtitle"><Input /></Form.Item>
          <Form.Item label="图片地址" name="imageUrl" rules={[{ required: true, message: '请输入图片地址' }]}><Input /></Form.Item>
          <Form.Item label="跳转链接" name="linkUrl"><Input /></Form.Item>
          <Form.Item label="排序" name="sort"><Input type="number" /></Form.Item>
          <Button type="primary" htmlType="submit" block>保存 Banner</Button>
        </Form>
      </Modal>
    </Space>
  );
}
