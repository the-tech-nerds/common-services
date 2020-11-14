import { Module, CacheModule as CommonCacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CommonCacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: 'redis',
        port: 6379,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
