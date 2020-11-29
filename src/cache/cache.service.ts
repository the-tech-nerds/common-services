import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key) {
    return this.cache.get(key);
  }

  async set(key, value, ttl = 100 * 60 * 60) {
    return this.cache.set(key, value, { ttl: ttl });
  }
}
