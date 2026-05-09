import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Popconfirm, Space, Tag, Tabs } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { StatusSwitch } from '../components/common';
import { CrudPage } from '../components/CrudPage';
import { CategoryManager } from '../components/CategoryManager';
import { productService } from '../services/product-service';
import { ProductCategoryItem, ProductItem } from '../types/product';
import { useMessage } from '../hooks/useMessage';

export function ProductsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      const [productResult, categoryResult] = await Promise.all([productService.list({ pageSize: 1000 }), productService.listCategories()]);
      setProducts(productResult.list);
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
      list: () => productService.listCategories(),
      create: (payload: { name: string; slug: string; sort?: number; status?: number }) => productService.createCategory(payload),
      update: (id: string, payload: { name?: string; slug?: string; sort?: number; status?: number }) => productService.updateCategory(id, payload),
      delete: (id: string) => productService.deleteCategory(id),
    }),
    [],
  );

  return (
    <Card>
      <Tabs
        items={[
          {
            key: 'products',
            label: '产品列表',
            children: (
              <CrudPage
                title="产品管理"
                description="管理产品信息和分类，支持图片上传和富文本描述。"
                columns={productColumns}
                dataSource={filteredProducts}
                loading={loading}
                search={{ placeholder: '搜索产品名称或摘要', value: searchText, onChange: setSearchText }}
                filter={{
                  placeholder: '筛选分类',
                  value: filterCategory,
                  onChange: (val) => setFilterCategory(val as string | undefined),
                  options: categories.map((cat) => ({ label: cat.name, value: cat.id })),
                }}
                onRefresh={() => void loadData()}
                onCreate={{ label: '新增产品', onClick: () => navigate('/content/products/new') }}
              />
            ),
          },
          {
            key: 'categories',
            label: '产品分类',
            children: (
              <CategoryManager
                service={categoryService}
                categoryName="分类"
                namePlaceholder="如：化工原料、催化剂"
                slugPlaceholder="如：chemical-raw-material"
                onChange={() => void loadData()}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
