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

export async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    next: { revalidate: 30 },
  });

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
