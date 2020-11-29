import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export async function setBootstrap(app: INestApplication) {
  const configService = app.get<ConfigService>(ConfigService);
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: configService.get('api_rate_limit_time') * 60 * 1000, // 15 minutes
      max: configService.get('api_rate_limit_max'), // limit each IP to 100 requests per windowMs
    }),
  );
}
