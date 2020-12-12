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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const roles_type_enum_1 = require("../../enum/roles-type.enum");
let RolesGuard = class RolesGuard {
    constructor(reflector, jwtService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    canActivate(context) {
        var _a;
        const roles = this.reflector.get('has-roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.access_token) || null;
        const { id: userId = null, roles: rols = null, } = this.jwtService.decode(token);
        if (!userId || !rols) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const userRoles = rols.map((role) => role.name);
        const systemRoles = roles.roles;
        switch (roles.type) {
            case roles_type_enum_1.RoleTypeEnum.hasRole:
                return this.hasRole(systemRoles, userRoles);
            case roles_type_enum_1.RoleTypeEnum.hasAnyRoles:
                return this.hasAnyRoles(systemRoles, userRoles);
            case roles_type_enum_1.RoleTypeEnum.hasAllRoles:
                return this.hasAllRoles(systemRoles, userRoles);
            default:
                return true;
        }
    }
    hasAnyRoles(systemRoles, userRoles) {
        try {
            for (let i = 0; i <= userRoles.length; i += 1) {
                for (let j = 0; j < systemRoles.length; j += 1) {
                    if (userRoles[i] === systemRoles[j]) {
                        return false;
                    }
                }
            }
            return false;
        }
        catch (e) {
            return true;
        }
    }
    hasRole(systemRoles, userRoles) {
        try {
            return !userRoles.find((role) => role === systemRoles[0]);
        }
        catch (e) {
            return true;
        }
    }
    hasAllRoles(systemRoles, userRoles) {
        try {
            return JSON.stringify(userRoles) !== JSON.stringify(systemRoles);
        }
        catch (e) {
            return true;
        }
    }
};
RolesGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map