import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async getHealth() {
    let database = 'ok';

    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      database = 'error';
    }

    return {
      code: 0,
      message: 'ok',
      data: {
        status: database === 'ok' ? 'ok' : 'degraded',
        service: 'company-web-server',
        database,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
