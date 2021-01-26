import { Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';

export interface EmailNotificationRequest {
  to: string[];
  from?: string;
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  template: string;
  data?: any;
  purpose?: string;
  tracking_id?: string;
  tracking_type?: string;
  fail_reason?: string;
  delivery_status?: string;
  attachments?: string;
}
@Injectable()
export class EmailNotification {
  constructor(private readonly gatewayService: GatewayService) {}

  send(emailNotificationRequest: EmailNotificationRequest) {
    this.gatewayService.execute('notification', {
      method: 'POST',
      path: '/api/v1/email/send/email',
      body: {
        ...emailNotificationRequest,
      },
    });
  }
}
