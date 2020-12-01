"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const gateway_service_1 = require("./gateway.service");
const ip_resolver_service_1 = require("./ip-resolver.service");
const __1 = require("..");
const fetch_module_1 = require("../fetch/fetch.module");
const fetch_access_code_service_1 = require("./fetch-access-code.service");
const fetch_access_token_service_1 = require("./fetch-access-token.service");
let GatewayModule = class GatewayModule {
};
GatewayModule = __decorate([
    common_1.Module({
        imports: [common_1.HttpModule, __1.CacheModule, fetch_module_1.FetchModule],
        providers: [
            gateway_service_1.GatewayService,
            ip_resolver_service_1.IpResolverService,
            fetch_access_code_service_1.FetchAccessCodeService,
            fetch_access_token_service_1.FetchAccessTokenService,
        ],
        exports: [gateway_service_1.GatewayService, ip_resolver_service_1.IpResolverService],
    })
], GatewayModule);
exports.GatewayModule = GatewayModule;
//# sourceMappingURL=gateway.module.js.map