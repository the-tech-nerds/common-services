import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';
import { setBootstrap } from './app.bootstrap';
import commonConfig from './config/common-config';
import { GatewayModule } from './gateway/gateway.module';
import { GatewayService } from './gateway/gateway.service';
import { GatewayMiddleware } from './gateway/gateway.middleware';

export { CacheModule, CacheService, setBootstrap, commonConfig };

export { GatewayModule, GatewayService, GatewayMiddleware };
