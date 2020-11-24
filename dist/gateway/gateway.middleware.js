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
const gateway_service_1 = require("./gateway.service");
let GatewayMiddleware = class GatewayMiddleware {
    constructor(gatewayService) {
        this.gatewayService = gatewayService;
    }
    use(req, res, next) {
        console.log('Request...');
        res.send("Unauthorized");
        next();
    }
};
GatewayMiddleware = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [gateway_service_1.GatewayService])
], GatewayMiddleware);
exports.GatewayMiddleware = GatewayMiddleware;
//# sourceMappingURL=gateway.middleware.js.map