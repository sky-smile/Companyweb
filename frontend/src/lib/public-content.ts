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
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    }
  } catch {
    return [];
  }

  return [];
}

export function parseProductParameters(
  value: string,
): Array<{ label: string; value: string }> {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === 'object' && item !== null) {
            const record = item as Record<string, unknown>;
            const label = typeof record.label === 'string' ? record.label : '';
            const parameterValue = typeof record.value === 'string' ? record.value : '';

            if (label || parameterValue) {
              return { label: label || '参数', value: parameterValue || '-' };
            }
          }

          return null;
        })
        .filter((item): item is { label: string; value: string } => item !== null);
    }

    if (typeof parsed === 'object' && parsed !== null) {
      return Object.entries(parsed as Record<string, unknown>).map(([label, parameterValue]) => ({
        label,
        value: typeof parameterValue === 'string' ? parameterValue : JSON.stringify(parameterValue),
      }));
    }
  } catch {
    return [];
  }

  return [];
}
