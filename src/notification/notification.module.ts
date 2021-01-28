import { Module } from '@nestjs/common';
import { EmailNotification } from './email-notification';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayModule } from '..';

@Module({
  imports: [GatewayModule],
  providers: [EmailNotification],
  exports: [EmailNotification],
})
export class NotificationModule {}
