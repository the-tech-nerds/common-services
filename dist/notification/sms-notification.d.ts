import { GatewayService } from '../gateway/gateway.service';
declare class SingleSmsRequest {
    msisdn: string;
    text: string;
    purpose: string;
    user_id: number;
}
export declare class SmsNotification {
    private readonly gatewayService;
    constructor(gatewayService: GatewayService);
    singleSmsSend(singleSmsRequest: SingleSmsRequest): void;
}
export {};
