import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {GatewayService} from "./gateway/gateway.service";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly gatewayService: GatewayService
  ) {}

  @Get('/hello')
  async getHello(): Promise<string> {
    // return this.appService.getHello();
    await this.gatewayService.execute("p", {});
    return "data";
  }
}
