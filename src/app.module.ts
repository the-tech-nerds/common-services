import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import commonConfig from './config/common-config';

@Module({
  imports: [
    CacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfig],
      envFilePath: '.common.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
