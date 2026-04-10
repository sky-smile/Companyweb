import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Space, Tabs, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { EnhancedUploadField, RichTextEditor, StatusSwitch } from '../components/common';
import { siteContentService } from '../services/site-content-service';
import { SitePageItem, SiteSettingItem, UpdateSiteSettingsPayload } from '../types/site-content';

export function SiteContentPage() {
  const [pageForm] = Form.useForm<SitePageItem>();
  const [settingsForm] = Form.useForm<UpdateSiteSettingsPayload>();
  const [loading, setLoading] = useState(false);
  const [currentPageKey, setCurrentPageKey] = useState('home');

  async function loadPage(pageKey: string) {
    const page = await siteContentService.getSitePage(pageKey);
    pageForm.setFieldsValue(page);
  }

  async function loadSettings() {
    const settings = await siteContentService.listSiteSettings();
    settingsForm.setFieldsValue({ items: settings.length > 0 ? settings : [{ settingKey: 'companyName', settingValue: '', settingGroup: 'company', description: '公司名称' }] });
  }

  async function loadData(pageKey = currentPageKey) {
    setLoading(true);
    try {
      await Promise.all([loadPage(pageKey), loadSettings()]);
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

  useEffect(() => {
    void loadData('home');
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>站点内容</Typography.Title>
        <Typography.Text type="secondary">管理首页、关于我们、联系我们等页面内容和站点设置。Banner 管理请在左侧菜单中操作。</Typography.Text>
      </div>

      <Tabs
        onChange={(key) => {
          if (['home', 'about', 'contact'].includes(key)) {
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
                  <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input placeholder="页面标题" />
                  </Form.Item>
                  <Form.Item label="正文" name="content">
                    <RichTextEditor height={400} placeholder="请输入首页介绍内容..." />
                  </Form.Item>
                  <Form.Item label="附加 JSON" name="extraJson">
                    <Input.TextArea rows={3} placeholder='可选，如 {"advantages": [...]}' />
                  </Form.Item>
                  <Form.Item label="SEO 标题" name="seoTitle">
                    <Input placeholder="搜索引擎显示的标题" />
                  </Form.Item>
                  <Form.Item label="SEO 描述" name="seoDescription">
                    <Input.TextArea rows={3} placeholder="搜索引擎显示的描述" />
                  </Form.Item>
                  <Form.Item label="状态" name="status" valuePropName="value" getValueFromEvent={(checked: boolean) => checked ? 1 : 0}>
                    <StatusSwitch checkedLabel="发布" uncheckedLabel="草稿" />
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'about',
            label: '关于我们',
            children: (
              <Card extra={<Button icon={<SaveOutlined />} type="primary" onClick={() => void pageForm.submit()}>保存页面</Button>}>
                <Form layout="vertical" form={pageForm} onFinish={handleSavePage}>
                  <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input placeholder="页面标题" />
                  </Form.Item>
                  <Form.Item label="正文" name="content">
                    <RichTextEditor height={500} placeholder="请输入关于我们内容..." />
                  </Form.Item>
                  <Form.Item label="SEO 标题" name="seoTitle">
                    <Input placeholder="搜索引擎显示的标题" />
                  </Form.Item>
                  <Form.Item label="SEO 描述" name="seoDescription">
                    <Input.TextArea rows={3} placeholder="搜索引擎显示的描述" />
                  </Form.Item>
                  <Form.Item label="状态" name="status" valuePropName="value" getValueFromEvent={(checked: boolean) => checked ? 1 : 0}>
                    <StatusSwitch checkedLabel="发布" uncheckedLabel="草稿" />
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'contact',
            label: '联系我们',
            children: (
              <Card extra={<Button icon={<SaveOutlined />} type="primary" onClick={() => void pageForm.submit()}>保存页面</Button>}>
                <Form layout="vertical" form={pageForm} onFinish={handleSavePage}>
                  <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input placeholder="页面标题" />
                  </Form.Item>
                  <Form.Item label="正文" name="content">
                    <RichTextEditor height={500} placeholder="请输入联系我们内容..." />
                  </Form.Item>
                  <Form.Item label="SEO 标题" name="seoTitle">
                    <Input placeholder="搜索引擎显示的标题" />
                  </Form.Item>
                  <Form.Item label="SEO 描述" name="seoDescription">
                    <Input.TextArea rows={3} placeholder="搜索引擎显示的描述" />
                  </Form.Item>
                  <Form.Item label="状态" name="status" valuePropName="value" getValueFromEvent={(checked: boolean) => checked ? 1 : 0}>
                    <StatusSwitch checkedLabel="发布" uncheckedLabel="草稿" />
                  </Form.Item>
                </Form>
              </Card>
            ),
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
        ]}
      />
    </Space>
  );
}
