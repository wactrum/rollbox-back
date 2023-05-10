import { Cache } from 'cache-manager';

export async function cacheWrapper<T>(
  cacheManager: Cache,
  type: string,
  key: string | number,
  initialFunction: () => Promise<T>,
  cacheDurationMs: number = 60 * 24 * 60000,
): Promise<T> {
  const cacheKey = `${type}_${key}`;
  const cached = await cacheManager.get<T | null>(cacheKey);
  if (cached !== null && cached !== undefined) {
    return cached;
  } else {
    const data = await initialFunction();
    await cacheManager.set(cacheKey, data, cacheDurationMs);
    return data;
  }
}