import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Tabs, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { UploadField } from '../components/common/UploadField';
import { newsService } from '../services/news-service';
import {
  CreateNewsCategoryPayload,
  CreateNewsPayload,
  NewsCategoryItem,
  NewsItem,
  UpdateNewsCategoryPayload,
} from '../types/news';

export function NewsPage() {
  const [categoryForm] = Form.useForm<CreateNewsCategoryPayload>();
  const [newsForm] = Form.useForm<CreateNewsPayload>();
  const [loading, setLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<NewsCategoryItem | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<NewsCategoryItem[]>([]);

  const newsColumns = useMemo(
    () => [
      { title: '标题', dataIndex: 'title', key: 'title' },
      { title: '分类', dataIndex: 'categoryName', key: 'categoryName' },
      { title: 'Slug', dataIndex: 'slug', key: 'slug' },
      { title: '摘要', dataIndex: 'summary', key: 'summary', render: (value: string) => value || '-' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value: number) => (value === 1 ? <Tag color="green">已发布</Tag> : <Tag>草稿</Tag>),
      },
      {
        title: '置顶',
        dataIndex: 'isTop',
        key: 'isTop',
        render: (value: number) => (value === 1 ? <Tag color="blue">置顶</Tag> : <Tag>普通</Tag>),
      },
      {
        title: '操作',
        key: 'actions',
        render: (_: unknown, record: NewsItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={async () => {
                const detail = await newsService.detail(record.id);
                setEditingNews(detail);
                newsForm.setFieldsValue(detail);
                setNewsModalOpen(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除这条新闻吗？"
              onConfirm={async () => {
                await newsService.delete(record.id);
                message.success('新闻已删除');
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
        render: (_: unknown, record: NewsCategoryItem) => (
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
                await newsService.deleteCategory(record.id);
                message.success('分类已删除');
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
      const [newsResult, categoryResult] = await Promise.all([newsService.list(), newsService.listCategories()]);
      setNewsList(newsResult.list);
      setCategories(categoryResult);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCategory(values: CreateNewsCategoryPayload | UpdateNewsCategoryPayload) {
    if (editingCategory === null) {
      await newsService.createCategory(values as CreateNewsCategoryPayload);
      message.success('新闻分类已创建');
    } else {
      await newsService.updateCategory(editingCategory.id, values);
      message.success('新闻分类已更新');
    }

    setCategoryModalOpen(false);
    setEditingCategory(null);
    categoryForm.resetFields();
    void loadData();
  }

  async function handleSaveNews(values: CreateNewsPayload) {
    if (editingNews === null) {
      await newsService.create(values);
      message.success('新闻已创建');
    } else {
      await newsService.update(editingNews.id, values);
      message.success('新闻已更新');
    }

    setNewsModalOpen(false);
    setEditingNews(null);
    newsForm.resetFields();
    void loadData();
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>新闻管理</Typography.Title>
        <Typography.Text type="secondary">现在已经接上新闻与分类的完整 CRUD 流程，支持上传封面回填。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" onClick={() => { setEditingNews(null); newsForm.resetFields(); setNewsModalOpen(true); }}>新增新闻</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCategory(null); categoryForm.resetFields(); setCategoryModalOpen(true); }}>新增分类</Button>
          </Space>
        }
      >
        <Tabs
          items={[
            {
              key: 'news',
              label: '新闻列表',
              children: <Table rowKey="id" loading={loading} columns={newsColumns} dataSource={newsList} pagination={false} />,
            },
            {
              key: 'categories',
              label: '新闻分类',
              children: <Table rowKey="id" loading={loading} columns={categoryColumns} dataSource={categories} pagination={false} />,
            },
          ]}
        />
      </Card>

      <Modal
        title={editingCategory === null ? '新增新闻分类' : '编辑新闻分类'}
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
          <Form.Item label="排序" name="sort" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>保存分类</Button>
        </Form>
      </Modal>

      <Modal
        title={editingNews === null ? '新增新闻' : '编辑新闻'}
        open={newsModalOpen}
        onCancel={() => {
          setNewsModalOpen(false);
          setEditingNews(null);
        }}
        footer={null}
        destroyOnHidden
        width={760}
      >
        <Form layout="vertical" form={newsForm} onFinish={handleSaveNews} initialValues={{ status: 0, isTop: 0 }}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
            <Select options={categories.map((item) => ({ label: item.name, value: item.id }))} />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入 slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="摘要" name="summary"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="封面图" name="coverImage"><UploadField folder="news" accept="image/*" buttonText="上传新闻封面" /></Form.Item>
          <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文内容' }]}><Input.TextArea rows={8} /></Form.Item>
          <Form.Item label="状态" name="status"><Input type="number" /></Form.Item>
          <Form.Item label="置顶" name="isTop"><Input type="number" /></Form.Item>
          <Button type="primary" htmlType="submit" block>保存新闻</Button>
        </Form>
      </Modal>
    </Space>
  );
}
