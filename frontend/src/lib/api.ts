export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3000/api';

// 缓存时间配置（按内容类型区分）
const CACHE_DURATION = {
  SHORT: 60,       // 1 分钟 - 频繁变化的数据（新闻、公告列表）
  MEDIUM: 300,     // 5 分钟 - 一般内容（产品列表、详情）
  LONG: 3600,      // 1 小时 - 静态内容（关于我们、联系方式）
  VERY_LONG: 86400, // 24 小时 - 几乎不变的数据（站点设置）
} as const;

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

export async function fetchApi<T>(
  path: string,
  options?: FetchOptions
): Promise<T> {
  const { revalidate = CACHE_DURATION.SHORT, tags } = options || {};

//  const fullUrl = `${apiBaseUrl}${path}`;
//  console.log(`[API] 请求地址:`, fullUrl);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate, tags },
    });
  } catch (error) {
    // 网络错误或 fetch 失败
    console.error(`[API] Fetch failed for ${path}:`, error);
    
    throw new ApiError(
      `无法连接到 API 服务，请确认后端服务已启动。${error instanceof Error ? error.message : ''}`,
      0,
      10001
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { code: number; message: string; data: T }
    | null;

  if (!response.ok) {
    throw new ApiError(payload?.message || `Request failed: ${path}`, response.status, payload?.code);
  }

  if (payload === null) {
    throw new ApiError(`Invalid response: ${path}`, response.status);
  }

  if (payload.code !== 0) {
    throw new ApiError(payload.message, response.status, payload.code);
  }

  return payload.data;
}

// 导出缓存配置供服务层使用
export { CACHE_DURATION };
