import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      code: 0,
      message: 'ok',
      data: {
        status: 'ok',
        service: 'company-web-server',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
