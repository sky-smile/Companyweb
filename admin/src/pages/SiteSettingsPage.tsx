import { useEffect, useState } from 'react';
import { Button, Card, Form, Image, Input, Space, Table, Typography, message } from 'antd';
import { PictureOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { MediaPicker } from '../components/common';
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

  function getSettingValue(key: string): string {
    return editingData.find(s => s.settingKey === key)?.settingValue || '';
  }

  function setSettingValue(key: string, value: string) {
    setEditingData(prev => {
      const newData = [...prev];
      const index = newData.findIndex(s => s.settingKey === key);
      if (index >= 0) {
        newData[index] = { ...newData[index], settingValue: value };
      } else {
        newData.push({
          settingKey: key,
          settingValue: value,
          settingGroup: 'company',
          description: key === 'siteLogo' ? '网站 Logo 图片' : '网站名称',
        });
      }
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

      {/* 站点基本信息卡片 */}
      <Card
        title="站点基本信息"
        extra={
          <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={handleSave}
            loading={saving}
          >
            保存设置
          </Button>
        }
      >
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          {/* Logo 设置 */}
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Typography.Text strong>网站 Logo</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              显示在首页顶栏左侧，建议使用 SVG 或 PNG 格式，尺寸约 180x40px
            </Typography.Text>
            {getSettingValue('siteLogo') && (
              <Image
                src={getSettingValue('siteLogo')}
                alt="当前 Logo"
                style={{ maxWidth: 200, maxHeight: 60, objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: 8, padding: 8, background: '#fafafa' }}
              />
            )}
            <MediaPicker
              value={getSettingValue('siteLogo')}
              onChange={(url) => setSettingValue('siteLogo', url)}
              folder="logos"
            />
          </Space>

          {/* 公司名称 */}
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Typography.Text strong>网站名称</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              显示在 Logo 右侧，如不设置则仅显示 Logo
            </Typography.Text>
            <Input
              value={getSettingValue('siteName')}
              onChange={(e) => setSettingValue('siteName', e.target.value)}
              placeholder="如：伊博化工"
              style={{ maxWidth: 400 }}
            />
          </Space>
        </Space>
      </Card>

      {/* 详细设置表格 */}
      <Card
        title="详细设置"
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
