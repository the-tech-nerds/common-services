import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../cache/cache.service';
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private readonly jwtService;
    private readonly cacheService;
    constructor(reflector: Reflector, jwtService: JwtService, cacheService: CacheService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    hasAnyPermissions(systemPermissions: string[], userPermissions: string[]): boolean;
    hasPermission(systemPermissions: string[], userPermissions: string[]): boolean;
    hasAllPermission(systemPermissions: string[], userPermissions: string[]): boolean;
}
