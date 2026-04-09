import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Table, Tag, Tabs, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { UploadField } from '../components/common/UploadField';
import { productService } from '../services/product-service';
import { CreateProductCategoryPayload, ProductCategoryItem, ProductItem } from '../types/product';

export function ProductsPage() {
  const [categoryForm] = Form.useForm<CreateProductCategoryPayload>();
  const [loading, setLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);

  const productColumns = useMemo(
    () => [
      { title: '产品名称', dataIndex: 'name', key: 'name' },
      { title: '分类', dataIndex: 'categoryName', key: 'categoryName' },
      { title: 'Slug', dataIndex: 'slug', key: 'slug' },
      { title: '摘要', dataIndex: 'summary', key: 'summary', render: (value: string) => value || '-' },
      { title: '排序', dataIndex: 'sort', key: 'sort' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value: number) => (value === 1 ? <Tag color="green">已发布</Tag> : <Tag>草稿</Tag>),
      },
    ],
    [],
  );

  const categoryColumns = useMemo(
    () => [
      { title: '分类名称', dataIndex: 'name', key: 'name' },
      { title: 'Slug', dataIndex: 'slug', key: 'slug' },
      { title: '排序', dataIndex: 'sort', key: 'sort' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value: number) => (value === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>),
      },
    ],
    [],
  );

  async function loadData() {
    setLoading(true);
    try {
      const [productResult, categoryResult] = await Promise.all([productService.list(), productService.listCategories()]);
      setProducts(productResult.list);
      setCategories(categoryResult);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCategory(values: CreateProductCategoryPayload) {
    await productService.createCategory(values);
    message.success('产品分类已创建');
    setCategoryModalOpen(false);
    categoryForm.resetFields();
    void loadData();
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>产品管理</Typography.Title>
        <Typography.Text type="secondary">当前已接上产品列表与产品分类列表，可继续扩展创建、编辑和图片参数维护。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCategoryModalOpen(true)}>新增分类</Button>
          </Space>
        }
      >
        <Card size="small" style={{ marginBottom: 16 }} title="产品图片上传回填">
          <UploadField folder="products" accept="image/*" buttonText="上传产品图片" />
        </Card>
        <Tabs
          items={[
            {
              key: 'products',
              label: '产品列表',
              children: <Table rowKey="id" loading={loading} columns={productColumns} dataSource={products} pagination={false} />,
            },
            {
              key: 'categories',
              label: '产品分类',
              children: <Table rowKey="id" loading={loading} columns={categoryColumns} dataSource={categories} pagination={false} />,
            },
          ]}
        />
      </Card>

      <Modal title="新增产品分类" open={categoryModalOpen} onCancel={() => setCategoryModalOpen(false)} footer={null} destroyOnHidden>
        <Form layout="vertical" form={categoryForm} onFinish={handleCreateCategory}>
          <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="分类标识" name="slug" rules={[{ required: true, message: '请输入分类标识' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="sort" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>保存分类</Button>
        </Form>
      </Modal>
    </Space>
  );
}
