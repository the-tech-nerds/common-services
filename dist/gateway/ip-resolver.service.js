"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpResolverService = void 0;
const common_1 = require("@nestjs/common");
const gateway_services_1 = require("./gateway.services");
let IpResolverService = class IpResolverService {
    constructor() {
        this.services = gateway_services_1.default;
    }
    resolve(serviceName, environment = 'local') {
        if (!this.services[serviceName]) {
            throw new common_1.HttpException(`Service ${serviceName} is not supported`, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (!this.services[serviceName][environment]) {
            throw new common_1.HttpException(`No information for ${environment} env of ${serviceName}`, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.services[serviceName][environment];
    }
};
IpResolverService = __decorate([
    common_1.Injectable()
], IpResolverService);
exports.IpResolverService = IpResolverService;
//# sourceMappingURL=ip-resolver.service.js.map