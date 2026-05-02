import { Global, Module } from '@nestjs/common';
import { CacheRevalidationService } from './cache-revalidation.service';

@Global()
@Module({
  providers: [CacheRevalidationService],
  exports: [CacheRevalidationService],
})
export class CacheRevalidationModule {}
