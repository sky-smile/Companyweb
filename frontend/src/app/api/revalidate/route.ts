import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json({ message: '未配置 REVALIDATION_SECRET' }, { status: 500 });
  }

  let body: { secret?: string; tags?: string[] };
  try {
    body = (await request.json()) as Record<string, unknown> as { secret?: string; tags?: string[] };
  } catch {
    return NextResponse.json({ message: '请求体格式错误' }, { status: 400 });
  }

  if (body.secret !== secret) {
    return NextResponse.json({ message: '无效的密钥' }, { status: 401 });
  }

  if (!Array.isArray(body.tags) || body.tags.length === 0) {
    return NextResponse.json({ message: '缺少 tags 参数' }, { status: 400 });
  }

  const results: { tag: string; error?: string }[] = [];

  for (const tag of body.tags) {
    try {
      revalidateTag(tag, 'max');
      results.push({ tag });
    } catch (err) {
      results.push({ tag, error: err instanceof Error ? err.message : '未知错误' });
    }
  }

  const failed = results.filter((r) => r.error);
  if (failed.length > 0) {
    return NextResponse.json({ message: '部分刷新失败', results }, { status: 207 });
  }

  return NextResponse.json({ revalidated: true, tags: results.map((r) => r.tag) });
}
