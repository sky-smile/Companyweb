export function formatPublicDate(value: string | null): string {
  if (!value) {
    return '待发布';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function parseStringArray(value: string): string[] {
  if (!value || typeof value !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map(item => item.trim());
    }

    // 如果是单个字符串，返回包含该字符串的数组
    if (typeof parsed === 'string' && parsed.trim().length > 0) {
      return [parsed.trim()];
    }
  } catch {
    // 如果解析失败，可能是直接的 URL 字符串
    if (typeof value === 'string' && value.trim().length > 0) {
      return [value.trim()];
    }
    return [];
  }

  return [];
}

export function parseProductParameters(
  value: string,
): Array<{ label: string; value: string }> {
  if (!value || typeof value !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === 'object' && item !== null) {
            const record = item as Record<string, unknown>;
            const label = typeof record.label === 'string' ? record.label.trim() : '';
            const parameterValue = typeof record.value === 'string' ? record.value.trim() : '';

            if (label || parameterValue) {
              return { label: label || '参数', value: parameterValue || '-' };
            }
          }
          
          // 处理字符串格式的参数
          if (typeof item === 'string') {
            const parts = item.split(':').map(s => s.trim());
            if (parts.length === 2) {
              return { label: parts[0], value: parts[1] };
            }
          }

          return null;
        })
        .filter((item): item is { label: string; value: string } => item !== null);
    }

    if (typeof parsed === 'object' && parsed !== null) {
      return Object.entries(parsed as Record<string, unknown>)
        .map(([label, parameterValue]) => ({
          label: label.trim(),
          value: typeof parameterValue === 'string' ? parameterValue.trim() : JSON.stringify(parameterValue),
        }))
        .filter(item => item.label || item.value);
    }
  } catch {
    // 如果不是 JSON，尝试解析键值对格式（每行一个：参数名: 参数值）
    const lines = value.split('\n').filter(line => line.trim());
    const parameters: Array<{ label: string; value: string }> = [];
    
    for (const line of lines) {
      const parts = line.split(':').map(s => s.trim());
      if (parts.length === 2 && parts[0] && parts[1]) {
        parameters.push({ label: parts[0], value: parts[1] });
      }
    }
    
    if (parameters.length > 0) {
      return parameters;
    }
    
    return [];
  }

  return [];
}
