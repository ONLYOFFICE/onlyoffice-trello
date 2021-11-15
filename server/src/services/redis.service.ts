import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

/**
 * A wrapper over cache-manager to handle Redis caching
 */
@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  /**
   * A GET Wrapper over cache-manager
   *
   * @param key An entry's key to fetch
   * @returns The entry's value or undefined
   */
  async get(key: string): Promise<string | undefined> {
    return await this.cache.get(key);
  }

  /**
   * A SET Wrapper over cache-manager
   *
   * @param key An entry to assign value to
   * @param value
   * @param ttl Time to live in seconds
   */
  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.cache.set(key, value, {
        ttl: ttl,
      });
    } else {
      await this.cache.set(key, value);
    }
  }

  /**
   * A DEL Wrapper over cache-manager
   *
   * @param key An entry to delete
   */
  async del(key: string) {
    try {
      await this.cache.del(key);
    } catch {}
  };
}
