"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const security_service_1 = require("./security/security.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const securityService = app.get(security_service_1.SecurityService);
    await securityService.setHelmet(app);
    await securityService.setCors(app);
    await securityService.setRateLimit(app);
    await securityService.setGlobalPrefix(app);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map