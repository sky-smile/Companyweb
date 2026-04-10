import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { siteContentService } from '../services/site-content-service';
import { SiteSettingItem, UpdateSiteSettingsPayload } from '../types/site-content';

interface SettingGroup {
  name: string;
  description: string;
  items: SiteSettingItem[];
}

export function SiteSettingsPage() {
  const [form] = Form.useForm<UpdateSiteSettingsPayload>();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettingItem[]>([]);
  const [groups, setGroups] = useState<SettingGroup[]>([]);

  async function loadSettings() {
    setLoading(true);
    try {
      const result = await siteContentService.listSiteSettings();
      setSettings(result);

      // 按分组组织数据
      const groupMap = new Map<string, SettingGroup>();
      result.forEach((item) => {
        const groupName = item.settingGroup || 'other';
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, {
            name: groupName,
            description: getGroupDescription(groupName),
            items: [],
          });
        }
        groupMap.get(groupName)!.items.push(item);
      });

      setGroups(Array.from(groupMap.values()));
      form.setFieldsValue({ items: result });
    } finally {
      setLoading(false);
    }
  }

  function getGroupDescription(group: string): string {
    const descriptions: Record<string, string> = {
      company: '公司基本信息',
      contact: '联系方式配置',
      seo: 'SEO 搜索引擎优化',
      social: '社交媒体链接',
      other: '其他设置',
    };
    return descriptions[group] || '其他设置';
  }

  async function handleSave(values: UpdateSiteSettingsPayload) {
    await siteContentService.updateSiteSettings(values);
    message.success('站点设置已保存');
    void loadSettings();
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>站点设置</Typography.Title>
        <Typography.Text type="secondary">配置公司基本信息、联系方式、SEO 设置和社交媒体链接。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadSettings()}>刷新</Button>
            <Button icon={<SaveOutlined />} type="primary" onClick={() => void form.submit()}>保存设置</Button>
          </Space>
        }
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.List name="items">
            {(fields) => (
              <Space orientation="vertical" size={32} style={{ display: 'flex' }}>
                {groups.map((group) => {
                  const groupFields = fields.filter((field) => {
                    const item = form.getFieldValue(['items', field.name]);
                    return item?.settingGroup === group.name;
                  });

                  if (groupFields.length === 0) return null;

                  return (
                    <div key={group.name}>
                      <Typography.Title level={4} style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                        {getGroupTitle(group.name)}
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                        {group.description}
                      </Typography.Text>

                      <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
                        {groupFields.map((field) => {
                          const item = form.getFieldValue(['items', field.name]);
                          return (
                            <Card key={field.key} size="small" style={{ background: '#fafafa' }}>
                              <Form.Item
                                label={item?.description || item?.settingKey || '设置项'}
                                name={[field.name, 'settingValue']}
                              >
                                {isLongText(item?.settingValue) ? (
                                  <Input.TextArea rows={3} placeholder="请输入内容" />
                                ) : (
                                  <Input placeholder="请输入内容" />
                                )}
                              </Form.Item>
                              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                键名: {item?.settingKey}
                              </Typography.Text>
                            </Card>
                          );
                        })}
                      </Space>
                    </div>
                  );
                })}
              </Space>
            )}
          </Form.List>
        </Form>

        {settings.length === 0 && (
          <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '40px 0' }}>
            暂无站点设置，请先在后端初始化设置数据。
          </Typography.Text>
        )}
      </Card>
    </Space>
  );
}

function getGroupTitle(group: string): string {
  const titles: Record<string, string> = {
    company: '🏢 公司信息',
    contact: '📞 联系方式',
    seo: '🔍 SEO 设置',
    social: '🌐 社交媒体',
    other: '⚙️ 其他设置',
  };
  return titles[group] || '⚙️ 其他设置';
}

function isLongText(value: string): boolean {
  if (!value) return false;
  return value.length > 50 || value.includes('\n');
}
