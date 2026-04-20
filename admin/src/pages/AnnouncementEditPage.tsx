import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Space, Spin, Typography, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { PublishStatus, RichTextEditor, StatusSwitch } from '../components/common';
import { announcementService } from '../services/announcement-service';
import { CreateAnnouncementPayload } from '../types/announcement';
import { useMessage } from '../hooks/useMessage';

export function AnnouncementEditPage() {
  const [form] = Form.useForm<CreateAnnouncementPayload>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const message = useMessage();

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(isEdit);

  useEffect(() => {
    async function loadData() {
      // 如果是编辑模式，加载公告详情
      if (isEdit && id) {
        setInitLoading(true);
        try {
          const detail = await announcementService.detail(id);
          form.setFieldsValue(detail);
        } catch {
          message.error('加载公告详情失败');
          navigate('/content/announcements');
        } finally {
          setInitLoading(false);
        }
      } else {
        // 新增模式，设置默认值
        form.setFieldsValue({ status: 0, isTop: 0 });
      }
    }

    void loadData();
  }, [id, isEdit, form, message, navigate]);

  const handleSubmit = async (values: CreateAnnouncementPayload) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await announcementService.update(id, values);
        message.success('公告已更新');
      } else {
        await announcementService.create(values);
        message.success('公告已创建');
      }
      navigate('/content/announcements');
    } catch {
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/content/announcements')}>公告管理</a> },
          { title: isEdit ? '编辑公告' : '新增公告' },
        ]}
      />

      {/* 页面标题 */}
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          {isEdit ? '编辑公告' : '新增公告'}
        </Typography.Title>
        <Typography.Text type="secondary">
          {isEdit ? '修改公告内容和设置' : '创建新的公司公告'}
        </Typography.Text>
      </div>

      {/* 表单卡片 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 0, isTop: 0 }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="公告标题" size="large" />
          </Form.Item>

          <Form.Item label="摘要" name="summary">
            <Input.TextArea rows={3} placeholder="公告简要摘要（可选）" />
          </Form.Item>

          <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文内容' }]}>
            <RichTextEditor height={500} placeholder="请输入公告正文..." />
          </Form.Item>

          <Card title="发布设置" size="small" style={{ marginTop: 24 }}>
            <Space size={24}>
              <Form.Item
                label="状态"
                name="status"
                valuePropName="value"
                getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}
              >
                <PublishStatus />
              </Form.Item>

              <Form.Item
                label="置顶"
                name="isTop"
                getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}
              >
                <StatusSwitch checkedLabel="置顶" uncheckedLabel="普通" />
              </Form.Item>
            </Space>
          </Card>

          {/* 底部操作栏 */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/content/announcements')}>
                返回列表
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                {isEdit ? '保存修改' : '创建公告'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </Space>
  );
}
