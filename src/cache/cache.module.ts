import { Module, CacheModule as CommonCacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CommonCacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis_global_host'),
        port: configService.get('redis_global_port'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
