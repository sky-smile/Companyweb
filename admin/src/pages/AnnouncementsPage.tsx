import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Popconfirm, Space, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { StatusSwitch } from '../components/common';
import { CrudPage } from '../components/CrudPage';
import { announcementService } from '../services/announcement-service';
import { AnnouncementItem } from '../types/announcement';
import { useMessage } from '../hooks/useMessage';

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const message = useMessage();

  const columns = useMemo(
    () => [
      { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
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
        render: (value: number, record: AnnouncementItem) => (
          <StatusSwitch
            checkedLabel="置顶"
            uncheckedLabel="普通"
            value={value}
            onChange={async (newValue) => {
              await announcementService.update(record.id, { isTop: newValue });
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
        render: (_: unknown, record: AnnouncementItem) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/content/announcements/${record.id}/edit`)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除这条公告吗？"
              onConfirm={async () => {
                await announcementService.delete(record.id);
                message.success('公告已删除');
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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = searchText
        ? item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.summary && item.summary.toLowerCase().includes(searchText.toLowerCase()))
        : true;
      const matchStatus = filterStatus !== undefined ? item.status === filterStatus : true;
      return matchSearch && matchStatus;
    });
  }, [items, searchText, filterStatus]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await announcementService.list({ pageSize: 1000 });
      setItems(result.list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <CrudPage
      title="公告管理"
      description="管理公司公告和通知，支持富文本编辑和置顶功能。"
      columns={columns}
      dataSource={filteredItems}
      loading={loading}
      search={{ placeholder: '搜索标题或摘要', value: searchText, onChange: setSearchText }}
      filter={{
        placeholder: '筛选状态',
        value: filterStatus,
        onChange: (val) => setFilterStatus(val as number | undefined),
        options: [
          { label: '已发布', value: 1 },
          { label: '草稿', value: 0 },
        ],
      }}
      onRefresh={() => void loadData()}
      onCreate={{ label: '新增公告', onClick: () => navigate('/content/announcements/new') }}
    />
  );
}
