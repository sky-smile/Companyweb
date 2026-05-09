import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Popconfirm, Space, Tag, Tabs } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { StatusSwitch } from '../components/common';
import { CrudPage } from '../components/CrudPage';
import { CategoryManager } from '../components/CategoryManager';
import { newsService } from '../services/news-service';
import { NewsCategoryItem, NewsItem } from '../types/news';
import { useMessage } from '../hooks/useMessage';

export function NewsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      const [newsResult, categoryResult] = await Promise.all([newsService.list({ pageSize: 1000 }), newsService.listCategories()]);
      setNewsList(newsResult.list);
      setCategories(categoryResult);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const categoryService = useMemo(
    () => ({
      list: () => newsService.listCategories(),
      create: (payload: { name: string; slug: string; sort?: number; status?: number }) => newsService.createCategory(payload),
      update: (id: string, payload: { name?: string; slug?: string; sort?: number; status?: number }) => newsService.updateCategory(id, payload),
      delete: (id: string) => newsService.deleteCategory(id),
    }),
    [],
  );

  return (
    <Card>
      <Tabs
        items={[
          {
            key: 'news',
            label: '新闻列表',
            children: (
              <CrudPage
                title="新闻管理"
                description="管理新闻内容和分类，支持富文本编辑和封面图上传。"
                columns={newsColumns}
                dataSource={filteredNewsList}
                loading={loading}
                search={{ placeholder: '搜索标题或摘要', value: searchText, onChange: setSearchText }}
                filter={{
                  placeholder: '筛选分类',
                  value: filterCategory,
                  onChange: (val) => setFilterCategory(val as string | undefined),
                  options: categories.map((cat) => ({ label: cat.name, value: cat.id })),
                }}
                onRefresh={() => void loadData()}
                onCreate={{ label: '新增新闻', onClick: () => navigate('/content/news/new') }}
              />
            ),
          },
          {
            key: 'categories',
            label: '新闻分类',
            children: (
              <CategoryManager
                service={categoryService}
                categoryName="分类"
                namePlaceholder="如：公司新闻、行业动态"
                slugPlaceholder="如：company-news"
                onChange={() => void loadData()}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
