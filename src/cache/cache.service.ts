import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheTypes } from '@/cache/cache.dto';

@Injectable()
export class CacheService {
  private baseTTL = 60 * 24 * 60000;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getOrCache<T>(
    type: CacheTypes,
    key: string | number,
    initialFunction: () => Promise<T>,
    cacheDurationMs: number = this.baseTTL
  ): Promise<T> {
    const cacheKey = `${type}_${key}`;
    const cached = await this.cacheManager.get<T | null>(cacheKey);
    if (cached !== null && cached !== undefined) {
      return cached;
    } else {
      const data = await initialFunction();
      await this.cacheManager.set(cacheKey, data, cacheDurationMs);
      return data;
    }
  }

  setCache(
    type: CacheTypes,
    key: string | number,
    data: any,
    cacheDurationMs: number = this.baseTTL
  ) {
    const cacheKey = `${type}_${key}`;
    return this.cacheManager.set(cacheKey, data, cacheDurationMs);
  }

  async resetCache(type: CacheTypes, key: string | number) {
    const cacheKey = `${type}_${key}`;
    return this.cacheManager.del(cacheKey);
  }

  async resetCacheWithoutKey(type: CacheTypes) {
    const cacheKeys = await this.cacheManager.store.keys();

    for (const cacheKey of cacheKeys) {
      const [cacheType] = cacheKey.split('_');

      if (cacheType === type) {
        await this.cacheManager.del(cacheKey);
      }
    }
  }
}
