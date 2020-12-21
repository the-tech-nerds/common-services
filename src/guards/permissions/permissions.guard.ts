import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../cache/cache.service';
import { PermissionTypeEnum } from '../../enum/permission-type.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const permissions = this.reflector.get<{
        permissions: string[];
        type: number;
      }>('has-permissions', context.getHandler());
      if (!permissions) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.access_token || null;

      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }

      const {
        id: userId = null,
        permissions: perms = null,
        roles: roles = null,
      } = this.jwtService.decode(token) as any;
      if (roles && roles.included('Super Admin')) return true;
      if (!userId || !perms) {
        throw new UnauthorizedException('Unauthorized');
      }

      const redisToken = await this.cacheService.get(`user-token-${userId}`);

      if (redisToken !== token) {
        throw new UnauthorizedException('Unauthorized');
      }

      const userPermissions = perms.map((permission: any) => permission.name);
      const systemPermission = permissions.permissions;
      switch (permissions.type) {
        case PermissionTypeEnum.hasPermission:
          return this.hasPermission(systemPermission, userPermissions);
        case PermissionTypeEnum.hasAnyPermissions:
          return this.hasAnyPermissions(systemPermission, userPermissions);
        case PermissionTypeEnum.hasAllPermissions:
          return this.hasAllPermission(systemPermission, userPermissions);
        default:
          return true;
      }
    } catch (e) {
      if (e.getStatus() === HttpStatus.UNAUTHORIZED) {
        throw e;
      } else {
        return false;
      }
    }
  }

  hasAnyPermissions(systemPermissions: string[], userPermissions: string[]) {
    let permissionMatch = false;
    try {
      for (let i = 0; i <= userPermissions.length; i += 1) {
        for (let j = 0; j < systemPermissions.length; j += 1) {
          if (userPermissions[i] === systemPermissions[j]) {
            permissionMatch = true;
            break;
          }
        }
      }
      permissionMatch = false;
    } catch (e) {
      throw new ForbiddenException('Forbidden Request');
    }
    if (!permissionMatch) {
      throw new ForbiddenException('Forbidden Request');
    }
    return true;
  }

  hasPermission(systemPermissions: string[], userPermissions: string[]) {
    let permissionMatch = -1;
    try {
      permissionMatch = userPermissions.findIndex(
        (permission: string) => permission === systemPermissions[0],
      );
    } catch (e) {
      throw new ForbiddenException('Forbidden Request');
    }
    if (permissionMatch === -1) {
      throw new ForbiddenException('Forbidden Request');
    }
    return true;
  }

  hasAllPermission(systemPermissions: string[], userPermissions: string[]) {
    let permissionMatch = false;
    try {
      permissionMatch =
        JSON.stringify(userPermissions) !== JSON.stringify(systemPermissions);
    } catch (e) {
      throw new ForbiddenException('Forbidden Request');
    }
    if (!permissionMatch) {
      throw new ForbiddenException('Forbidden Request');
    }
    return true;
  }
}
