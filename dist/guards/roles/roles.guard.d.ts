import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
export declare class RolesGuard implements CanActivate {
    private reflector;
    private readonly jwtService;
    constructor(reflector: Reflector, jwtService: JwtService);
    canActivate(context: ExecutionContext): boolean;
    hasAnyRoles(systemRoles: string[], userRoles: string[]): boolean;
    hasRole(systemRoles: string[], userRoles: string[]): boolean;
    hasAllRoles(systemRoles: string[], userRoles: string[]): boolean;
}
