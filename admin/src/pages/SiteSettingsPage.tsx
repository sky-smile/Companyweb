import { useEffect, useState } from 'react';
import { Button, Card, Image, Input, Space, Typography, Tabs } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { MediaPicker } from '../components/common';
import { siteContentService } from '../services/site-content-service';
import { SiteSettingItem, UpdateSiteSettingsPayload } from '../types/site-content';
import { useMessage } from '../hooks/useMessage';

const { TextArea } = Input;

export function SiteSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettingItem[]>([]);
  const [editingData, setEditingData] = useState<SiteSettingItem[]>([]);
  const message = useMessage();

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
          settingGroup: 'contact',
          description: key,
        });
      }
      return newData;
    });
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  const tabItems = [
    {
      key: 'contact',
      label: '联系我们',
      children: (
        <ContactTab
          editingData={editingData}
          setEditingData={setEditingData}
          getSettingValue={getSettingValue}
          setSettingValue={setSettingValue}
          handleValueChange={handleValueChange}
          handleSave={handleSave}
          saving={saving}
        />
      ),
    },
    {
      key: 'site',
      label: '站点基本信息',
      children: (
        <SiteInfoTab
          editingData={editingData}
          getSettingValue={getSettingValue}
          setSettingValue={setSettingValue}
          loading={loading}
          saving={saving}
          handleSave={handleSave}
        />
      ),
    },
    {
      key: 'copyright',
      label: '版权设置',
      children: (
        <CopyrightTab
          editingData={editingData}
          getSettingValue={getSettingValue}
          setSettingValue={setSettingValue}
          handleSave={handleSave}
          saving={saving}
        />
      ),
    },
  ];

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>站点设置</Typography.Title>
        <Typography.Text type="secondary">
          配置公司基本信息、联系方式和 SEO 设置。修改后点击保存按钮生效。
        </Typography.Text>
      </div>

      <Tabs items={tabItems} defaultActiveKey="contact" size="large" />
    </Space>
  );
}

// ==================== 联系我们 Tab ====================

interface ContactTabProps {
  editingData: SiteSettingItem[];
  setEditingData: React.Dispatch<React.SetStateAction<SiteSettingItem[]>>;
  getSettingValue: (key: string) => string;
  setSettingValue: (key: string, value: string) => void;
  handleValueChange: (index: number, value: string) => void;
}

function ContactTab({ editingData, setEditingData, getSettingValue, setSettingValue, handleSave, saving }: ContactTabProps & { handleSave: () => void; saving: boolean }) {
  const contactFields = [
    { key: 'contactAddress', label: '公司地址', icon: <EnvironmentOutlined />, placeholder: '请输入公司详细地址' },
    { key: 'contactEmail', label: '电子邮箱', icon: <MailOutlined />, placeholder: 'example@company.com' },
    { key: 'contactPhone', label: '联系电话', icon: <PhoneOutlined />, placeholder: '400-888-8888' },
    { key: 'contactWebsite', label: '公司网站', icon: <GlobalOutlined />, placeholder: 'https://www.company.com' },
    { key: 'contactWorkTime', label: '工作时间', icon: <ClockCircleOutlined />, placeholder: '周一至周五 9:00-18:00' },
  ];

  return (
    <Card
      extra={
        <Button icon={<SaveOutlined />} type="primary" onClick={handleSave} loading={saving}>
          保存设置
        </Button>
      }
    >
      <Space orientation="vertical" size={24} style={{ width: '100%' }}>
        {contactFields.map((field) => {
          const currentValue = getSettingValue(field.key);

          return (
            <Space key={field.key} orientation="vertical" size={8} style={{ width: '100%' }}>
              <Space>
                {field.icon}
                <Typography.Text strong>{field.label}</Typography.Text>
              </Space>
              <Input
                value={currentValue}
                onChange={(e) => setSettingValue(field.key, e.target.value)}
                placeholder={field.placeholder}
                style={{ maxWidth: 500 }}
              />
            </Space>
          );
        })}
      </Space>
    </Card>
  );
}

// ==================== 站点基本信息 Tab ====================

interface SiteInfoTabProps {
  editingData: SiteSettingItem[];
  getSettingValue: (key: string) => string;
  setSettingValue: (key: string, value: string) => void;
  loading: boolean;
  saving: boolean;
  handleSave: () => void;
}

function SiteInfoTab({ editingData, getSettingValue, setSettingValue, loading, saving, handleSave }: SiteInfoTabProps) {
  return (
    <Card
      extra={
        <Button icon={<SaveOutlined />} type="primary" onClick={handleSave} loading={saving}>
          保存设置
        </Button>
      }
    >
      <Space orientation="vertical" size={24} style={{ width: '100%' }}>
        {/* Logo 设置 */}
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
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
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
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
  );
}

// ==================== 版权设置 Tab ====================

interface CopyrightTabProps {
  editingData: SiteSettingItem[];
  getSettingValue: (key: string) => string;
  setSettingValue: (key: string, value: string) => void;
  handleSave: () => void;
  saving: boolean;
}

function CopyrightTab({ getSettingValue, setSettingValue, handleSave, saving }: CopyrightTabProps) {
  return (
    <Card
      extra={
        <Button icon={<SaveOutlined />} type="primary" onClick={handleSave} loading={saving}>
          保存设置
        </Button>
      }
    >
      <Space orientation="vertical" size={24} style={{ width: '100%' }}>
        {/* 版权信息 */}
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
          <Typography.Text strong>网站版权信息</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            显示在页脚底部，支持自定义文本，如：© 2024 公司名称. All rights reserved.
          </Typography.Text>
          <Input.TextArea
            value={getSettingValue('copyrightText')}
            onChange={(e) => setSettingValue('copyrightText', e.target.value)}
            placeholder="例如：© 2024 白银市伊博化工科技有限公司. All rights reserved."
            rows={3}
            maxLength={200}
            showCount
            style={{ maxWidth: 600 }}
          />
        </Space>

        {/* 提示信息 */}
        <div style={{ padding: '12px 16px', background: '#f0f5ff', borderRadius: 6, border: '1px solid #d4e3fc' }}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            💡 提示：如不设置，将默认显示 "© 当前年份 公司名称. All rights reserved."
          </Typography.Text>
        </div>
      </Space>
    </Card>
  );
}
