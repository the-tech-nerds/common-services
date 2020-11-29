"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBootstrap = void 0;
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config_1 = require("@nestjs/config");
async function setBootstrap(app) {
    const configService = app.get(config_1.ConfigService);
    app.use(helmet());
    app.enableCors();
    app.use(rateLimit({
        windowMs: configService.get('api_rate_limit_time') * 60 * 1000,
        max: configService.get('api_rate_limit_max'),
    }));
}
exports.setBootstrap = setBootstrap;
//# sourceMappingURL=app.bootstrap.js.map