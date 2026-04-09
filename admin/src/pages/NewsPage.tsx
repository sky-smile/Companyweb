import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Table, Tag, Tabs, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { newsService } from '../services/news-service';
import { CreateNewsCategoryPayload, NewsCategoryItem, NewsItem } from '../types/news';

export function NewsPage() {
  const [categoryForm] = Form.useForm<CreateNewsCategoryPayload>();
  const [loading, setLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
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
      const [newsResult, categoryResult] = await Promise.all([newsService.list(), newsService.listCategories()]);
      setNewsList(newsResult.list);
      setCategories(categoryResult);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCategory(values: CreateNewsCategoryPayload) {
    await newsService.createCategory(values);
    message.success('新闻分类已创建');
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
        <Typography.Title level={2} style={{ marginBottom: 8 }}>新闻管理</Typography.Title>
        <Typography.Text type="secondary">当前已接上新闻列表与新闻分类列表，可继续扩展创建、编辑和发布流程。</Typography.Text>
      </div>

      <Card
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCategoryModalOpen(true)}>新增分类</Button>
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

      <Modal title="新增新闻分类" open={categoryModalOpen} onCancel={() => setCategoryModalOpen(false)} footer={null} destroyOnHidden>
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
