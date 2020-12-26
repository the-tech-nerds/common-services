"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const cache_service_1 = require("../../cache/cache.service");
const permission_type_enum_1 = require("../../enum/permission-type.enum");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector, jwtService, cacheService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
        this.cacheService = cacheService;
    }
    async canActivate(context) {
        var _a;
        try {
            const permissions = this.reflector.get('has-permissions', context.getHandler());
            if (!permissions) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const token = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.access_token) || null;
            if (!token) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            const { id: userId = null, permissions: perms = null, roles: roles = [], } = this.jwtService.decode(token);
            const superAdminRoleIndex = roles.findIndex(role => { var _a; return ((_a = role === null || role === void 0 ? void 0 : role.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'super admin'; });
            if (superAdminRoleIndex != -1)
                return true;
            if (!userId || !perms) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            const redisToken = await this.cacheService.get(`user-token-${userId}`);
            if (redisToken !== token) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            const userPermissions = perms.map((permission) => permission.name);
            const systemPermission = permissions.permissions;
            switch (permissions.type) {
                case permission_type_enum_1.PermissionTypeEnum.hasPermission:
                    return this.hasPermission(systemPermission, userPermissions);
                case permission_type_enum_1.PermissionTypeEnum.hasAnyPermissions:
                    return this.hasAnyPermissions(systemPermission, userPermissions);
                case permission_type_enum_1.PermissionTypeEnum.hasAllPermissions:
                    return this.hasAllPermission(systemPermission, userPermissions);
                default:
                    return true;
            }
        }
        catch (e) {
            if (e.getStatus() === common_1.HttpStatus.UNAUTHORIZED) {
                throw e;
            }
            else {
                return false;
            }
        }
    }
    hasAnyPermissions(systemPermissions, userPermissions) {
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
        }
        catch (e) {
            throw new common_1.ForbiddenException('Forbidden Request');
        }
        if (!permissionMatch) {
            throw new common_1.ForbiddenException('Forbidden Request');
        }
        return true;
    }
    hasPermission(systemPermissions, userPermissions) {
        let permissionMatch = -1;
        try {
            permissionMatch = userPermissions.findIndex((permission) => permission === systemPermissions[0]);
        }
        catch (e) {
            throw new common_1.ForbiddenException('Forbidden Request');
        }
        if (permissionMatch === -1) {
            throw new common_1.ForbiddenException('Forbidden Request');
        }
        return true;
    }
    hasAllPermission(systemPermissions, userPermissions) {
        let permissionMatch = false;
        try {
            permissionMatch =
                JSON.stringify(userPermissions) !== JSON.stringify(systemPermissions);
        }
        catch (e) {
            throw new common_1.ForbiddenException('Forbidden Request');
        }
        if (!permissionMatch) {
            throw new common_1.ForbiddenException('Forbidden Request');
        }
        return true;
    }
};
PermissionsGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        cache_service_1.CacheService])
], PermissionsGuard);
exports.PermissionsGuard = PermissionsGuard;
//# sourceMappingURL=permissions.guard.js.map