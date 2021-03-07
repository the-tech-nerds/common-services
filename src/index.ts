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
import { User as CurrentUser } from './decorators/user.decorator';
import PermissionTypes from './enum/permission.type';
import { ApiResponseService } from './api-response/api-response.service';
import { ApiResponseModule } from './api-response/api-response.module';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';
import { EmailNotification } from './notification/email-notification';
import { SmsNotification } from './notification/sms-notification';
import { NotificationModule } from './notification/notification.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Paginate, PaginateQuery } from './pagination/decorator';
import { paginate, Paginated } from './pagination/paginate';

export {
  CacheModule,
  CacheService,
  setBootstrap,
  commonConfig,
  // commandRegistration,
};

export { FetchModule, FetchService };

export { GatewayModule, GatewayService, GatewayMiddleware };

export {
  UserGuard,
  PermissionsGuard,
  HasPermissions,
  PermissionTypeEnum,
  PermissionTypes,
  CurrentUser,
  JwtStrategy,
};

export { ApiResponseModule, ApiResponseService };

export { UploadModule, UploadService };
export { NotificationModule, EmailNotification, SmsNotification };

export { Paginate, PaginateQuery, paginate, Paginated };
