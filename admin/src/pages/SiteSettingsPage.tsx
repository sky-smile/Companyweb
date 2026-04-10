import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Space, Table, Typography, message } from 'antd';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { siteContentService } from '../services/site-content-service';
import { SiteSettingItem, UpdateSiteSettingsPayload } from '../types/site-content';

export function SiteSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettingItem[]>([]);
  const [editingData, setEditingData] = useState<SiteSettingItem[]>([]);

  async function loadSettings() {
    setLoading(true);
    try {
      const result = await siteContentService.listSiteSettings();
      setSettings(result);
      setEditingData(result.map(item => ({ ...item })));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload: UpdateSiteSettingsPayload = {
        items: editingData.map(item => ({
          settingKey: item.settingKey,
          settingValue: item.settingValue,
          settingGroup: item.settingGroup,
          description: item.description,
        })),
      };
      await siteContentService.updateSiteSettings(payload);
      message.success('站点设置已保存');
      void loadSettings();
    } catch (error) {
      message.error('保存失败，请重试');
      console.error('Save settings error:', error);
    } finally {
      setSaving(false);
    }
  }

  function handleValueChange(index: number, value: string) {
    setEditingData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], settingValue: value };
      return newData;
    });
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  const columns = [
    {
      title: '设置项',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (desc: string, record: SiteSettingItem) => (
        <div>
          <div>{desc || record.settingKey}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.settingKey}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: '分组',
      dataIndex: 'settingGroup',
      key: 'settingGroup',
      width: 120,
      render: (group: string) => (
        <Typography.Text type="secondary">{getGroupTitle(group)}</Typography.Text>
      ),
    },
    {
      title: '值',
      dataIndex: 'settingValue',
      key: 'settingValue',
      render: (value: string, _record: SiteSettingItem, index: number) => (
        <Input
          value={editingData[index]?.settingValue || ''}
          onChange={(e) => handleValueChange(index, e.target.value)}
          placeholder="请输入设置值"
        />
      ),
    },
  ];

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>站点设置</Typography.Title>
        <Typography.Text type="secondary">
          配置公司基本信息、联系方式、SEO 设置和社交媒体链接。修改后点击保存按钮生效。
        </Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadSettings()} loading={loading}>
              刷新
            </Button>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={handleSave}
              loading={saving}
              disabled={editingData.length === 0}
            >
              保存设置
            </Button>
          </Space>
        }
      >
        <Table
          rowKey={(record) => record.settingKey}
          loading={loading}
          dataSource={editingData}
          columns={columns}
          pagination={false}
          locale={{ emptyText: '暂无站点设置，请先在后端初始化设置数据。' }}
        />
      </Card>
    </Space>
  );
}

function getGroupTitle(group: string): string {
  const titles: Record<string, string> = {
    company: '公司信息',
    contact: '联系方式',
    seo: 'SEO 设置',
    social: '社交媒体',
    other: '其他设置',
  };
  return titles[group] || group || '其他设置';
}
