import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SecurityService } from './security/security.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const securityService = app.get<SecurityService>(SecurityService);
  await securityService.setHelmet(app);
  await securityService.setCors(app);
  await securityService.setRateLimit(app);
  await securityService.setGlobalPrefix(app);
  await app.listen(3000);
}
bootstrap();
