import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GatewayService } from './gateway/gateway.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gatewayService: GatewayService,
  ) {}

  @Get('/hello')
  async getHello(): Promise<any> {
    // return this.appService.getHello();
    const products = await this.gatewayService.execute('product', {
      path: '/api/v1/products',
    });
    console.log(products);
    return products;
  }
}
