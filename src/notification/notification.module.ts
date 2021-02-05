import { Module } from '@nestjs/common';
import { EmailNotification } from './email-notification';
import { GatewayModule } from '..';
import { SmsNotification } from './sms-notification';

@Module({
  imports: [GatewayModule],
  providers: [EmailNotification, SmsNotification],
  exports: [EmailNotification, SmsNotification],
})
export class NotificationModule {}
