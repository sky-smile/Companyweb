import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Tabs, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { UploadField } from '../components/common/UploadField';
import { productService } from '../services/product-service';
import {
  CreateProductCategoryPayload,
  CreateProductPayload,
  ProductCategoryItem,
  ProductItem,
  UpdateProductCategoryPayload,
} from '../types/product';

export function ProductsPage() {
  const [categoryForm] = Form.useForm<CreateProductCategoryPayload>();
  const [productForm] = Form.useForm<CreateProductPayload>();
  const [loading, setLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategoryItem | null>(null);
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
      {
        title: '操作',
        key: 'actions',
        render: (_: unknown, record: ProductItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={async () => {
                const detail = await productService.detail(record.id);
                setEditingProduct(detail);
                productForm.setFieldsValue(detail);
                setProductModalOpen(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除这个产品吗？"
              onConfirm={async () => {
                await productService.delete(record.id);
                message.success('产品已删除');
                void loadData();
              }}
            >
              <Button danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        ),
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
      {
        title: '操作',
        key: 'actions',
        render: (_: unknown, record: ProductCategoryItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingCategory(record);
                categoryForm.setFieldsValue(record);
                setCategoryModalOpen(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除这个分类吗？"
              onConfirm={async () => {
                await productService.deleteCategory(record.id);
                message.success('产品分类已删除');
                void loadData();
              }}
            >
              <Button danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        ),
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

  async function handleSaveCategory(values: CreateProductCategoryPayload | UpdateProductCategoryPayload) {
    if (editingCategory === null) {
      await productService.createCategory(values as CreateProductCategoryPayload);
      message.success('产品分类已创建');
    } else {
      await productService.updateCategory(editingCategory.id, values);
      message.success('产品分类已更新');
    }

    setCategoryModalOpen(false);
    setEditingCategory(null);
    categoryForm.resetFields();
    void loadData();
  }

  async function handleSaveProduct(values: CreateProductPayload) {
    if (editingProduct === null) {
      await productService.create(values);
      message.success('产品已创建');
    } else {
      await productService.update(editingProduct.id, values);
      message.success('产品已更新');
    }

    setProductModalOpen(false);
    setEditingProduct(null);
    productForm.resetFields();
    void loadData();
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>产品管理</Typography.Title>
        <Typography.Text type="secondary">现在已经接上产品与分类的完整 CRUD 流程，并支持图片与参数字段维护。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" onClick={() => { setEditingProduct(null); productForm.resetFields(); setProductModalOpen(true); }}>新增产品</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCategory(null); categoryForm.resetFields(); setCategoryModalOpen(true); }}>新增分类</Button>
          </Space>
        }
      >
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

      <Modal
        title={editingCategory === null ? '新增产品分类' : '编辑产品分类'}
        open={categoryModalOpen}
        onCancel={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={categoryForm} onFinish={handleSaveCategory}>
          <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="分类标识" name="slug" rules={[{ required: true, message: '请输入分类标识' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="sort" initialValue={0}><Input type="number" /></Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}><Input type="number" /></Form.Item>
          <Button type="primary" htmlType="submit" block>保存分类</Button>
        </Form>
      </Modal>

      <Modal
        title={editingProduct === null ? '新增产品' : '编辑产品'}
        open={productModalOpen}
        onCancel={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        footer={null}
        destroyOnHidden
        width={760}
      >
        <Form layout="vertical" form={productForm} onFinish={handleSaveProduct} initialValues={{ status: 0, sort: 0 }}>
          <Form.Item label="产品名称" name="name" rules={[{ required: true, message: '请输入产品名称' }]}><Input /></Form.Item>
          <Form.Item label="分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
            <Select options={categories.map((item) => ({ label: item.name, value: item.id }))} />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入 slug' }]}><Input /></Form.Item>
          <Form.Item label="摘要" name="summary"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="产品图片 JSON" name="imagesJson"><UploadField folder="products" accept="image/*" buttonText="上传产品图片" /></Form.Item>
          <Form.Item label="参数 JSON" name="parametersJson"><Input.TextArea rows={4} /></Form.Item>
          <Form.Item label="正文" name="content"><Input.TextArea rows={6} /></Form.Item>
          <Form.Item label="状态" name="status"><Input type="number" /></Form.Item>
          <Form.Item label="排序" name="sort"><Input type="number" /></Form.Item>
          <Button type="primary" htmlType="submit" block>保存产品</Button>
        </Form>
      </Modal>
    </Space>
  );
}
