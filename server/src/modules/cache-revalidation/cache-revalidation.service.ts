import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheRevalidationService {
  private readonly logger = new Logger(CacheRevalidationService.name);

  constructor(private readonly configService: ConfigService) {}

  /** 通知前端刷新指定的缓存标签（不阻塞主流程） */
  revalidate(tags: string[]): Promise<void> {
    const frontendUrl = this.configService.get<string>('frontend.url');
    const secret = this.configService.get<string>('frontend.revalidationSecret');

    if (!frontendUrl || !secret) {
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
