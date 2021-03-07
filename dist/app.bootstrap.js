"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBootstrap = void 0;
const helmet = require("helmet");
async function setBootstrap(app, microserviceConfig = {}) {
    if (Object.keys(microserviceConfig).length > 0) {
        await app.connectMicroservice(microserviceConfig);
        await app.startAllMicroservicesAsync();
    }
    app.use(helmet());
    app.enableCors();
}
exports.setBootstrap = setBootstrap;
//# sourceMappingURL=app.bootstrap.js.map