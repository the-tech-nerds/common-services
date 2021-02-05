import { GatewayService } from '../gateway/gateway.service';
import { Injectable } from '@nestjs/common';

class SingleSmsRequest {
  msisdn: string;
  text: string;
  purpose: string;
  user_id: number;
}
@Injectable()
export class SmsNotification {
  constructor(private readonly gatewayService: GatewayService) {}

  singleSmsSend(singleSmsRequest: SingleSmsRequest) {
    this.gatewayService.execute('notification', {
      method: 'POST',
      path: '/api/v1/sms/send/single-sms',
      body: {
        ...singleSmsRequest,
      },
    });
  }
}
