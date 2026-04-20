import { Button, Card, Empty, Input, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useCallback } from 'react';

export interface ParameterItem {
  key: string;
  value: string;
}

interface ProductParametersEditorProps {
  value?: ParameterItem[] | string;
  onChange?: (params: ParameterItem[]) => void;
  placeholder?: { key?: string; value?: string };
}

export function ProductParametersEditor({
  value,
  onChange,
  placeholder = { key: '参数名称', value: '参数值' },
}: ProductParametersEditorProps) {
  // 智能解析 value：可能是数组、JSON 字符串或 undefined
  let params: ParameterItem[] = [];
  if (Array.isArray(value)) {
    params = value;
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          params = parsed
            .map((item) => {
              if (typeof item === 'object' && item !== null) {
                const record = item as Record<string, unknown>;
                const label = String(record.label || record.key || '');
                const val = String(record.value || '');
                return label ? { key: label, value: val } : null;
              }
              return null;
            })
            .filter((p): p is ParameterItem => p !== null);
        } else if (typeof parsed === 'object' && parsed !== null) {
          params = Object.entries(parsed as Record<string, unknown>).map(([key, val]) => ({
            key,
            value: typeof val === 'string' ? val : JSON.stringify(val),
          }));
        }
      } catch {
        params = [];
      }
    }
  }

  const handleAdd = useCallback(() => {
    const newParams = [...params, { key: '', value: '' }];
    onChange?.(newParams);
  }, [params, onChange]);

  const handleDelete = useCallback(
    (index: number) => {
      const newParams = params.filter((_, i) => i !== index);
      onChange?.(newParams);
    },
    [params, onChange],
  );

  const handleKeyChange = useCallback(
    (index: number, newKey: string) => {
      const newParams = params.map((item, i) => (i === index ? { ...item, key: newKey } : item));
      onChange?.(newParams);
    },
    [params, onChange],
  );

  const handleValueChange = useCallback(
    (index: number, newValue: string) => {
      const newParams = params.map((item, i) => (i === index ? { ...item, value: newValue } : item));
      onChange?.(newParams);
    },
    [params, onChange],
  );

  const isValid = params.length === 0 || params.every((p) => p.key.trim() !== '' && p.value.trim() !== '');

  return (
    <Card size="small" style={{ background: '#fafafa' }}>
      {params.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无产品参数"
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {params.map((param, index) => (
            <Space key={index} style={{ width: '100%' }} align="baseline">
              <Input
                placeholder={placeholder.key}
                value={param.key}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                style={{ flex: 1, minWidth: 120 }}
              />
              <span style={{ color: '#666' }}>:</span>
              <Input
                placeholder={placeholder.value}
                value={param.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                style={{ flex: 1.5, minWidth: 180 }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(index)}
                style={{ flexShrink: 0 }}
              />
            </Space>
          ))}
        </Space>
      )}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ width: '100%', marginTop: params.length > 0 ? 8 : 0 }}
      >
        添加参数
      </Button>

      {params.length > 0 && !isValid && (
        <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 12 }}>
          请确保每个参数名称和参数值都已填写
        </div>
      )}
    </Card>
  );
}

export function parseParametersJson(jsonStr: string | undefined): ParameterItem[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);

    // 格式1: 对象数组 [{label: "...", value: "..."}]
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === 'object' && item !== null) {
            const record = item as Record<string, unknown>;
            const label = typeof record.label === 'string' ? record.label.trim() : '';
            const val = typeof record.value === 'string' ? record.value.trim() : '';
            if (label) {
              return { key: label, value: val };
            }
          }
          return null;
        })
        .filter((item): item is ParameterItem => item !== null);
    }

    // 格式2: 简单键值对 {"key": "value"}
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.entries(parsed as Record<string, unknown>).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value.trim() : JSON.stringify(value),
      }));
    }

    return [];
  } catch {
    return [];
  }
}

export function stringifyParametersJson(params: ParameterItem[]): string {
  if (params.length === 0) return '';
  const validParams = params.filter((p) => p.key.trim() !== '');
  if (validParams.length === 0) return '';

  // 使用对象数组格式，与种子数据保持一致
  return JSON.stringify(
    validParams.map((p) => ({
      label: p.key.trim(),
      value: p.value.trim(),
    })),
  );
}
