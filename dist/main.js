"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_bootstrap_1 = require("./app.bootstrap");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app_bootstrap_1.setBootstrap(app);
    await app.listen(9000);
}
bootstrap();
//# sourceMappingURL=main.js.map