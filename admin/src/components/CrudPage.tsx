import { type ReactNode, useMemo } from 'react';
import type { TableProps } from 'antd';
import { Button, Card, Input, Select, Space, Table, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

interface SearchConfig {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

interface FilterConfig {
  placeholder?: string;
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  options: { label: string; value: string | number }[];
}

interface CrudPageProps<T> {
  title: string;
  description?: string;
  columns: TableProps<T>['columns'];
  dataSource: T[];
  loading?: boolean;
  search?: SearchConfig;
  filter?: FilterConfig;
  onCreate?: { label: string; onClick: () => void };
  onRefresh?: () => void;
  pagination?: TableProps<T>['pagination'];
  extra?: ReactNode;
  children?: ReactNode;
}

export function CrudPage<T extends object>({
  title,
  description,
  columns,
  dataSource,
  loading = false,
  search,
  filter,
  onCreate,
  onRefresh,
  pagination: externalPagination,
  extra,
  children,
}: CrudPageProps<T>) {
  const defaultPagination = useMemo<TableProps<T>['pagination']>(
    () => ({
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showTotal: (total: number) => `共 ${total} 条`,
    }),
    [],
  );

  return (
    <Space orientation="vertical" size={20} style={{ display: 'flex' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>{title}</Typography.Title>
        {description && <Typography.Text type="secondary">{description}</Typography.Text>}
      </div>

      <Card extra={extra}>
        <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
          {(search || filter || onRefresh || onCreate) && (
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Space>
                {search && (
                  <Input
                    placeholder={search.placeholder ?? '搜索'}
                    prefix={<SearchOutlined />}
                    value={search.value}
                    onChange={(e) => search.onChange(e.target.value)}
                    style={{ width: 240 }}
                    allowClear
                  />
                )}
                {filter && (
                  <Select
                    placeholder={filter.placeholder ?? '筛选'}
                    value={filter.value}
                    onChange={(val) => filter.onChange(val)}
                    style={{ width: 140 }}
                    allowClear
                    options={filter.options}
                  />
                )}
              </Space>
              <Space>
                {onRefresh && (
                  <Button icon={<ReloadOutlined />} onClick={onRefresh}>刷新</Button>
                )}
                {onCreate && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={onCreate.onClick}>
                    {onCreate.label}
                  </Button>
                )}
              </Space>
            </Space>
          )}

          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={externalPagination ?? defaultPagination}
          />
        </Space>
      </Card>

      {children}
    </Space>
  );
}
