import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Typography, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { MediaPicker, MultiImageUploadField, ProductParametersEditor, parseParametersJson, stringifyParametersJson, PublishStatus, RichTextEditor, SortInput } from '../components/common';
import { productService } from '../services/product-service';
import { CreateProductPayload, ProductCategoryItem } from '../types/product';
import { useMessage } from '../hooks/useMessage';

export function ProductEditPage() {
  const [form] = Form.useForm<CreateProductPayload>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const message = useMessage();

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(isEdit);
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [parameters, setParameters] = useState<Array<{ key: string; value: string }>>([]);

  useEffect(() => {
    async function loadData() {
      // 加载分类列表
      const categoryResult = await productService.listCategories();
      setCategories(categoryResult);

      // 如果是编辑模式，加载产品详情
      if (isEdit && id) {
        setInitLoading(true);
        try {
          const detail = await productService.detail(id);

          // 解析 parametersJson 为可视化参数数组
          const parsedParams = parseParametersJson(detail.parametersJson);
          setParameters(parsedParams);

          // 延迟设置表单值，确保表单已挂载
          setTimeout(() => {
            form.setFieldsValue(detail);
          }, 0);
        } catch {
          message.error('加载产品详情失败');
          navigate('/content/products');
        } finally {
          setInitLoading(false);
        }
      } else {
        // 新增模式，设置默认值
        form.setFieldsValue({ status: 0, sort: 0 });
      }
    }

    void loadData();
  }, [id, isEdit, form, message, navigate]);

  const handleSubmit = async (values: CreateProductPayload) => {
    setLoading(true);
    try {
      // 将可视化参数数组转换为 JSON 字符串
      const jsonParams = stringifyParametersJson(parameters);
      const submitData: CreateProductPayload = {
        ...values,
        parametersJson: jsonParams || undefined,
      };

      if (isEdit && id) {
        await productService.update(id, submitData);
        message.success('产品已更新');
      } else {
        await productService.create(submitData);
        message.success('产品已创建');
      }
      navigate('/content/products');
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
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/content/products')}>产品管理</a> },
          { title: isEdit ? '编辑产品' : '新增产品' },
        ]}
      />

      {/* 页面标题 */}
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          {isEdit ? '编辑产品' : '新增产品'}
        </Typography.Title>
        <Typography.Text type="secondary">
          {isEdit ? '修改产品信息和设置' : '创建新的产品条目'}
        </Typography.Text>
      </div>

      {/* 表单卡片 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 0, sort: 0 }}
        >
          <Row gutter={32}>
            {/* 左侧：主要编辑区域 */}
            <Col xs={24} lg={16}>
              <Form.Item label="产品名称" name="name" rules={[{ required: true, message: '请输入产品名称' }]}>
                <Input placeholder="产品名称" size="large" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
                    <Select
                      placeholder="选择产品分类"
                      size="large"
                      options={categories.map((item) => ({ label: item.name, value: item.id }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入 slug' }]}>
                    <Input placeholder="如：product-a12" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="摘要" name="summary">
                <Input.TextArea rows={3} placeholder="产品简要摘要（可选）" />
              </Form.Item>

              <Form.Item label="详细描述" name="content">
                <RichTextEditor height={400} placeholder="请输入产品详细描述..." />
              </Form.Item>

              <Form.Item
                label="产品参数"
                name="parametersJson"
                tooltip="添加产品的技术参数，如纯度、包装规格、存储条件等"
              >
                <ProductParametersEditor
                  value={parameters}
                  onChange={setParameters}
                  placeholder={{ key: '参数名称', value: '参数值' }}
                />
              </Form.Item>
            </Col>

            {/* 右侧：设置区域 */}
            <Col xs={24} lg={8}>
              <Card title="发布设置" size="small" style={{ marginBottom: 16 }}>
                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                  <Form.Item
                    label="状态"
                    name="status"
                    valuePropName="value"
                    getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}
                  >
                    <PublishStatus />
                  </Form.Item>

                  <Form.Item label="排序" name="sort">
                    <SortInput />
                  </Form.Item>
                </Space>
              </Card>

              <Card title="产品图片" size="small">
                <Form.Item label="产品图片（最多5张）" name="imagesJson">
                  <MultiImageUploadField folder="products" accept="image/*" maxCount={5} />
                </Form.Item>

                <Form.Item label="从媒体库选择">
                  <MediaPicker folder="products" />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          {/* 底部操作栏 */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/content/products')}>
                返回列表
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                {isEdit ? '保存修改' : '创建产品'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </Space>
  );
}
