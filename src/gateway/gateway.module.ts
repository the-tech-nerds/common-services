import {HttpModule, HttpService, Module} from '@nestjs/common';
import {GatewayService} from "./gateway.service";
import {IpResolverService} from "./ip-resolver.service";
import { CacheService, CacheModule} from "..";
import {FetchModule} from "../fetch/fetch.module";

@Module({
  imports: [HttpModule, CacheModule, FetchModule],
  providers: [GatewayService, IpResolverService],
  exports: [GatewayService, IpResolverService],
})
export class GatewayModule {}
