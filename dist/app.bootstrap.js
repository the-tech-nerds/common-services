"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBootstrap = void 0;
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
async function setBootstrap(app) {
    app.use(helmet());
    app.enableCors();
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.setGlobalPrefix('api/v1');
}
exports.setBootstrap = setBootstrap;
//# sourceMappingURL=app.bootstrap.js.map