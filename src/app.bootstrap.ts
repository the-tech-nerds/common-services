import * as helmet from 'helmet';
import { INestApplication } from '@nestjs/common';

export async function setBootstrap(
  app: INestApplication,
  microserviceConfig = {},
) {
  if (Object.keys(microserviceConfig).length > 0) {
    await app.connectMicroservice(microserviceConfig);
    await app.startAllMicroservicesAsync();
  }

  app.use(helmet());
  app.enableCors();
}
