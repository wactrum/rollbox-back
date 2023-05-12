import { Global, Module } from '@nestjs/common';
import { CacheModule as Cache } from '@nestjs/cache-manager';
import { CacheService } from '@/infrastructure/cache/cache.service';

@Global()
@Module({
  imports: [Cache.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
