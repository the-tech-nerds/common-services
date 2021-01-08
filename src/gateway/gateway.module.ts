import { HttpModule, Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { IpResolverService } from './ip-resolver.service';
import { CacheModule } from '..';
import { FetchModule } from '..';
import { FetchAccessCodeService } from './fetch-access-code.service';
import { FetchAccessTokenService } from './fetch-access-token.service';
import { CustomLoggerService } from '../logger/customLogger.service';

@Module({
  imports: [HttpModule, CacheModule, FetchModule],
  providers: [
    GatewayService,
    IpResolverService,
    FetchAccessCodeService,
    FetchAccessTokenService,
    CustomLoggerService,
  ],
  exports: [GatewayService, IpResolverService],
})
export class GatewayModule {}
