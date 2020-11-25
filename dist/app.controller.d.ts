import { AppService } from './app.service';
import { GatewayService } from './gateway/gateway.service';
export declare class AppController {
    private readonly appService;
    private readonly gatewayService;
    constructor(appService: AppService, gatewayService: GatewayService);
    getHello(): Promise<any>;
}
