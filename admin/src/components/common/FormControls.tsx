import { InputNumber, Select, Switch } from 'antd';

/**
 * 状态选择器 - 使用 Switch 组件
 */
interface StatusSwitchProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
}

export function StatusSwitch({
  value = 0,
  onChange,
  disabled = false,
  checkedLabel = '启用',
  uncheckedLabel = '禁用',
}: StatusSwitchProps) {
  return (
    <Switch
      checked={value === 1}
      onChange={(checked) => onChange?.(checked ? 1 : 0)}
      checkedChildren={checkedLabel}
      unCheckedChildren={uncheckedLabel}
      disabled={disabled}
    />
  );
}

/**
 * 发布状态选择器
 */
interface PublishStatusProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function PublishStatus({ value = 0, onChange, disabled = false }: PublishStatusProps) {
  return (
    <Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ width: 120 }}
      options={[
        { label: '草稿', value: 0 },
        { label: '已发布', value: 1 },
      ]}
    />
  );
}

/**
 * 排序输入器
 */
interface SortInputProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export function SortInput({ value = 0, onChange, disabled = false, min = 0, max = 9999 }: SortInputProps) {
  return (
    <InputNumber
      value={value}
      onChange={(val) => onChange?.(val ?? 0)}
      disabled={disabled}
      min={min}
      max={max}
      style={{ width: '100%' }}
      placeholder="排序值，越大越靠前"
    />
  );
}
