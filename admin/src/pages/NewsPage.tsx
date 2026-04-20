import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Tabs, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { EnhancedUploadField, MediaPicker, PublishStatus, RichTextEditor, StatusSwitch } from '../components/common';
import { newsService } from '../services/news-service';
import {
  CreateNewsCategoryPayload,
  CreateNewsPayload,
  NewsCategoryItem,
  NewsItem,
  UpdateNewsCategoryPayload,
} from '../types/news';
import { useMessage } from '../hooks/useMessage';

export function NewsPage() {
  const navigate = useNavigate();
  const [categoryForm] = Form.useForm<CreateNewsCategoryPayload>();
  const [loading, setLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsCategoryItem | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<NewsCategoryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const message = useMessage();

  const newsColumns = useMemo(
    () => [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
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
      {
        title: '置顶',
        dataIndex: 'isTop',
        key: 'isTop',
        width: 100,
        render: (value: number, record: NewsItem) => (
          <StatusSwitch
            checkedLabel="置顶"
            uncheckedLabel="普通"
            value={value}
            onChange={async (newValue) => {
              await newsService.update(record.id, { isTop: newValue });
              message.success(newValue === 1 ? '已设为置顶' : '已取消置顶');
              void loadData();
            }}
          />
        ),
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (_: unknown, record: NewsItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/content/news/${record.id}/edit`)}
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
        render: (_: unknown, record: NewsCategoryItem) => (
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
                await newsService.deleteCategory(record.id);
                message.success('分类已删除');
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

  const filteredNewsList = useMemo(() => {
    return newsList.filter((news) => {
      const matchSearch = searchText
        ? news.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (news.summary && news.summary.toLowerCase().includes(searchText.toLowerCase()))
        : true;
      const matchCategory = filterCategory ? news.categoryId === filterCategory : true;
      return matchSearch && matchCategory;
    });
  }, [newsList, searchText, filterCategory]);

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

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>新闻管理</Typography.Title>
        <Typography.Text type="secondary">管理新闻内容和分类，支持富文本编辑和封面图上传。</Typography.Text>
      </div>

      <Card>
        <Tabs
          items={[
            {
              key: 'news',
              label: '新闻列表',
              children: (
                <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                      <Input
                        placeholder="搜索标题或摘要"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 240 }}
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
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/content/news/new')}>
                        新增新闻
                      </Button>
                    </Space>
                  </Space>
                  <Table
                    rowKey="id"
                    loading={loading}
                    columns={newsColumns}
                    dataSource={filteredNewsList}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                  />
                </Space>
              ),
            },
            {
              key: 'categories',
              label: '新闻分类',
              children: (
                <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCategory(null); categoryForm.resetFields(); setCategoryModalOpen(true); }}>
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
            <Input placeholder="如：公司新闻、行业动态" />
          </Form.Item>
          <Form.Item label="分类标识" name="slug" rules={[{ required: true, message: '请输入分类标识' }]}>
            <Input placeholder="如：company-news" />
          </Form.Item>
          <Form.Item label="排序" name="sort" initialValue={0}>
            <Input type="number" placeholder="值越大越靠前" />
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
