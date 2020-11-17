import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [CacheModule, SecurityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
