import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Tabs, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { EnhancedUploadField, MediaPicker, MultiImageUploadField, PublishStatus, RichTextEditor, SortInput, StatusSwitch } from '../components/common';
import { productService } from '../services/product-service';
import {
  CreateProductCategoryPayload,
  CreateProductPayload,
  ProductCategoryItem,
  ProductItem,
  UpdateProductCategoryPayload,
} from '../types/product';
import { useMessage } from '../hooks/useMessage';

export function ProductsPage() {
  const navigate = useNavigate();
  const [categoryForm] = Form.useForm<CreateProductCategoryPayload>();
  const [loading, setLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategoryItem | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const message = useMessage();

  const productColumns = useMemo(
    () => [
      {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
      },
      { title: '分类', dataIndex: 'categoryName', key: 'categoryName', width: 120 },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (value: number) => (value === 1 ? <Tag color="green">已发布</Tag> : <Tag>草稿</Tag>),
      },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (_: unknown, record: ProductItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/content/products/${record.id}/edit`)}
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
              <Button danger icon={<DeleteOutlined />} size="small">删除</Button>
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
      { title: '标识', dataIndex: 'slug', key: 'slug' },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (value: number) => (value === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>),
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (_: unknown, record: ProductCategoryItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
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
              <Button danger icon={<DeleteOutlined />} size="small">删除</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = searchText
        ? product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (product.summary && product.summary.toLowerCase().includes(searchText.toLowerCase()))
        : true;
      const matchCategory = filterCategory ? product.categoryId === filterCategory : true;
      return matchSearch && matchCategory;
    });
  }, [products, searchText, filterCategory]);

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

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>产品管理</Typography.Title>
        <Typography.Text type="secondary">管理产品信息和分类，支持图片上传和富文本描述。</Typography.Text>
      </div>

      <Card>
        <Tabs
          items={[
            {
              key: 'products',
              label: '产品列表',
              children: (
                <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                      <Input
                        placeholder="搜索产品名称或摘要"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 260 }}
                        allowClear
                      />
                      <Select
                        placeholder="筛选分类"
                        value={filterCategory}
                        onChange={(val) => setFilterCategory(val)}
                        style={{ width: 160 }}
                        allowClear
                        options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
                      />
                    </Space>
                    <Space>
                      <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/content/products/new')}
                      >
                        新增产品
                      </Button>
                    </Space>
                  </Space>
                  <Table
                    rowKey="id"
                    loading={loading}
                    columns={productColumns}
                    dataSource={filteredProducts}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                  />
                </Space>
              ),
            },
            {
              key: 'categories',
              label: '产品分类',
              children: (
                <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingCategory(null);
                        categoryForm.resetFields();
                        setCategoryModalOpen(true);
                      }}
                    >
                      新增分类
                    </Button>
                  </div>
                  <Table
                    rowKey="id"
                    loading={loading}
                    columns={categoryColumns}
                    dataSource={categories}
                    pagination={false}
                  />
                </Space>
              ),
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
            <Input placeholder="如：化工原料、催化剂" />
          </Form.Item>
          <Form.Item label="分类标识" name="slug" rules={[{ required: true, message: '请输入分类标识' }]}>
            <Input placeholder="如：chemical-raw-material" />
          </Form.Item>
          <Form.Item label="排序" name="sort" initialValue={0}>
            <SortInput />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1} valuePropName="value" getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}>
            <StatusSwitch />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>保存分类</Button>
        </Form>
      </Modal>
    </Space>
  );
}
