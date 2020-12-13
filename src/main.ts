import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setBootstrap } from './app.bootstrap';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setBootstrap(app);
  await app.listen(9000);
}
bootstrap();
