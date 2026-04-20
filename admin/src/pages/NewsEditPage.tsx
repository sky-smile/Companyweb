import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Typography, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { EnhancedUploadField, MediaPicker, PublishStatus, RichTextEditor, StatusSwitch } from '../components/common';
import { newsService } from '../services/news-service';
import { CreateNewsPayload, NewsCategoryItem, NewsItem } from '../types/news';
import { useMessage } from '../hooks/useMessage';

export function NewsEditPage() {
  const [form] = Form.useForm<CreateNewsPayload>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const message = useMessage();

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(isEdit);
  const [categories, setCategories] = useState<NewsCategoryItem[]>([]);

  useEffect(() => {
    async function loadData() {
      // 加载分类列表
      const categoryResult = await newsService.listCategories();
      setCategories(categoryResult);

      // 如果是编辑模式，加载新闻详情
      if (isEdit && id) {
        setInitLoading(true);
        try {
          const detail = await newsService.detail(id);
          form.setFieldsValue(detail);
        } catch {
          message.error('加载新闻详情失败');
          navigate('/content/news');
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

  const handleSubmit = async (values: CreateNewsPayload) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await newsService.update(id, values);
        message.success('新闻已更新');
      } else {
        await newsService.create(values);
        message.success('新闻已创建');
      }
      navigate('/content/news');
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
          { title: <a onClick={() => navigate('/content/news')}>新闻管理</a> },
          { title: isEdit ? '编辑新闻' : '新增新闻' },
        ]}
      />

      {/* 页面标题 */}
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          {isEdit ? '编辑新闻' : '新增新闻'}
        </Typography.Title>
        <Typography.Text type="secondary">
          {isEdit ? '修改新闻内容和设置' : '创建新的新闻文章'}
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
          <Row gutter={32}>
            {/* 左侧：主要编辑区域 */}
            <Col xs={24} lg={16}>
              <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="新闻标题" size="large" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
                    <Select
                      placeholder="选择分类"
                      size="large"
                      options={categories.map((item) => ({ label: item.name, value: item.id }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入 slug' }]}>
                    <Input placeholder="如：news-2024-01-01" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="摘要" name="summary">
                <Input.TextArea rows={3} placeholder="新闻简要摘要（可选）" />
              </Form.Item>

              <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文内容' }]}>
                <RichTextEditor height={450} placeholder="请输入新闻正文..." />
              </Form.Item>
            </Col>

            {/* 右侧：设置区域 */}
            <Col xs={24} lg={8}>
              <Card title="发布设置" size="small" style={{ marginBottom: 16 }}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
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

              <Card title="封面图片" size="small">
                <Form.Item label="从媒体库选择" name="coverImage">
                  <MediaPicker folder="news" />
                </Form.Item>

                <Form.Item label="或上传新图片">
                  <EnhancedUploadField
                    folder="news"
                    accept="image/*"
                    onChange={(url) => form.setFieldValue('coverImage', url)}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          {/* 底部操作栏 */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/content/news')}>
                返回列表
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                {isEdit ? '保存修改' : '创建新闻'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </Space>
  );
}
