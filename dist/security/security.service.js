"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
let SecurityService = class SecurityService {
    async setHelmet(app) {
        app.use(helmet());
    }
    async setCors(app) {
        app.enableCors();
    }
    async setRateLimit(app) {
        app.use(rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
        }));
    }
    async setGlobalPrefix(app) {
        app.setGlobalPrefix('api/v1');
    }
};
SecurityService = __decorate([
    common_1.Injectable()
], SecurityService);
exports.SecurityService = SecurityService;
//# sourceMappingURL=security.service.js.map