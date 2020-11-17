import { Injectable } from '@nestjs/common';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

@Injectable()
export class SecurityService {
  // constructor() {}
  async setHelmet(app: any): Promise<void> {
    app.use(helmet());
  }
  async setCors(app: any): Promise<void> {
    app.enableCors();
  }
  async setRateLimit(app: any): Promise<void> {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }
  async setGlobalPrefix(app: any): Promise<void> {
    app.setGlobalPrefix('api/v1');
  }
}
