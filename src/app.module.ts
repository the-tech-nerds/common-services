import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import commonConfig from './config/common-config';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [
    CacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfig],
      envFilePath: '.common.env',
    }),
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
