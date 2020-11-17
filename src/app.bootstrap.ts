import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
export async function setBootstrap(app: any) {
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.setGlobalPrefix('api/v1');
}
