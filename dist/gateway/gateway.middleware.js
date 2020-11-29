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
exports.GatewayMiddleware = void 0;
const common_1 = require("@nestjs/common");
const __1 = require("..");
let GatewayMiddleware = class GatewayMiddleware {
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    async use(req, res, next) {
        if (req.header('client_access_token')) {
            const requestFrom = req.header('client_name');
            const redisKey = `client-access-token-${requestFrom}`;
            const data = await this.cacheService.get(redisKey);
            if (data) {
                next();
            }
            else {
                throw new common_1.UnauthorizedException();
            }
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
};
GatewayMiddleware = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [__1.CacheService])
], GatewayMiddleware);
exports.GatewayMiddleware = GatewayMiddleware;
//# sourceMappingURL=gateway.middleware.js.map