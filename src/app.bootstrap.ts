import * as helmet from 'helmet';
import { INestApplication } from '@nestjs/common';

export async function setBootstrap(app: INestApplication) {
  app.use(helmet());
  app.enableCors();
}
