import { Module } from '@nestjs/common';
import { EmailNotification } from './email-notification';
import { GatewayService } from '../gateway/gateway.service';

@Module({
  imports: [GatewayService],
  providers: [EmailNotification],
  exports: [EmailNotification],
})
export class NotificationModule {}
