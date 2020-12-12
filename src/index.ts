import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';
import { setBootstrap } from './app.bootstrap';
import commonConfig from './config/common-config';
import { GatewayModule } from './gateway/gateway.module';
import { GatewayService } from './gateway/gateway.service';
import { GatewayMiddleware } from './gateway/gateway.middleware';
import { FetchModule } from './fetch/fetch.module';
import { FetchService } from './fetch/fetch.service';
import { PermissionsGuard } from './guards/permissions/permissions.guard';
import { UserGuard } from './guards/user/user.guard';
import { HasPermissions } from './guards/meta-data/permissions/permissions.decorator';
import { PermissionTypeEnum } from './enum/permission-type.enum';
import { User } from './decorators/user.decorator';
import PermissionTypes from './enum/permission.type';

export { CacheModule, CacheService, setBootstrap, commonConfig };

export { FetchModule, FetchService };

export { GatewayModule, GatewayService, GatewayMiddleware };

export {
  UserGuard,
  PermissionsGuard,
  HasPermissions,
  PermissionTypeEnum,
  PermissionTypes,
  User,
};
