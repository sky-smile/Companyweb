import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheRevalidationService {
  private readonly logger = new Logger(CacheRevalidationService.name);

  constructor(private readonly configService: ConfigService) {}

  /** 通知前端刷新指定的缓存标签（不阻塞主流程） */
  revalidate(tags: string[]): Promise<void> {
    // 直接读取环境变量，而不是通过 ConfigService
    const frontendUrl = process.env.FRONTEND_URL || this.configService.get<string>('frontend.url');
    const secret = process.env.REVALIDATION_SECRET || this.configService.get<string>('frontend.revalidationSecret');

    if (!frontendUrl || !secret) {
      this.logger.warn(`缓存刷新跳过：缺少配置 FRONTEND_URL 或 REVALIDATION_SECRET`);
      return Promise.resolve();
    }

    return fetch(`${frontendUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          this.logger.warn(`缓存刷新失败 (${tags.join(', ')})：HTTP ${res.status} ${body}`);
        } else {
          this.logger.log(`缓存已刷新：${tags.join(', ')}`);
        }
      })
      .catch((err) => {
        this.logger.error(`缓存刷新请求异常 (${tags.join(', ')})：${err.message}`);
      });
  }
}
