const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3000/api';

export async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  const payload = (await response.json()) as { code: number; message: string; data: T };

  if (payload.code !== 0) {
    throw new Error(payload.message);
  }

  return payload.data;
}
