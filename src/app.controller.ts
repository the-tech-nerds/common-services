import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheService } from './cache/cache.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('/hello')
  async getHello(): Promise<any> {
    await this.cacheService.delete('user-token-3');
    return this.appService.getHello();
  }
}
