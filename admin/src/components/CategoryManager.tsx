import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { StatusSwitch } from './common';
import { useMessage } from '../hooks/useMessage';

/** 通用分类项接口 */
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  sort: number;
  status: number;
}

/** 创建分类载荷 */
export interface CreateCategoryPayload {
  name: string;
  slug: string;
  sort?: number;
  status?: number;
}

/** 更新分类载荷 */
export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  sort?: number;
  status?: number;
}

/** 分类服务接口 */
export interface CategoryService<T extends CategoryItem> {
  list: () => Promise<T[]>;
  create: (payload: CreateCategoryPayload) => Promise<void>;
  update: (id: string, payload: UpdateCategoryPayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

interface CategoryManagerProps<T extends CategoryItem> {
  service: CategoryService<T>;
  /** 分类名称，用于提示信息 */
  categoryName: string;
  /** 分类名称输入框占位符 */
  namePlaceholder?: string;
  /** 分类标识输入框占位符 */
  slugPlaceholder?: string;
  /** 数据变更后的回调 */
  onChange?: () => void;
}

export function CategoryManager<T extends CategoryItem>({
  service,
  categoryName,
  namePlaceholder = '请输入分类名称',
  slugPlaceholder = '请输入分类标识',
  onChange,
}: CategoryManagerProps<T>) {
  const [form] = Form.useForm<CreateCategoryPayload>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<T | null>(null);
  const [categories, setCategories] = useState<T[]>([]);
  const message = useMessage();

  const columns = [
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
      render: (_: unknown, record: T) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingCategory(record);
              form.setFieldsValue(record);
              setModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确认删除这个${categoryName}吗？`}
            onConfirm={async () => {
              await service.delete(record.id);
              message.success(`${categoryName}已删除`);
              void loadData();
            }}
          >
            <Button danger icon={<DeleteOutlined />} size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  async function loadData() {
    setLoading(true);
    try {
      const result = await service.list();
      setCategories(result);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(values: CreateCategoryPayload | UpdateCategoryPayload) {
    if (editingCategory === null) {
      await service.create(values as CreateCategoryPayload);
      message.success(`${categoryName}已创建`);
    } else {
      await service.update(editingCategory.id, values);
      message.success(`${categoryName}已更新`);
    }

    setModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
    void loadData();
    onChange?.();
  }

  // 初始化加载数据
  useEffect(() => {
    void loadData();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          新增{categoryName}
        </Button>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={categories}
        pagination={false}
      />

      <Modal
        title={editingCategory === null ? `新增${categoryName}` : `编辑${categoryName}`}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item label={`${categoryName}名称`} name="name" rules={[{ required: true, message: `请输入${categoryName}名称` }]}>
            <Input placeholder={namePlaceholder} />
          </Form.Item>
          <Form.Item label={`${categoryName}标识`} name="slug" rules={[{ required: true, message: `请输入${categoryName}标识` }]}>
            <Input placeholder={slugPlaceholder} />
          </Form.Item>
          <Form.Item label="排序" name="sort" initialValue={0}>
            <Input type="number" placeholder="值越大越靠前" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1} valuePropName="value" getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}>
            <StatusSwitch />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>保存{categoryName}</Button>
        </Form>
      </Modal>
    </>
  );
}
