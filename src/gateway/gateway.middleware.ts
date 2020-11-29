import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CacheService } from '..';

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: CacheService) {}
  async use(req: Request, res: Response, next: any) {
    if (req.header('client_access_token')) {
      const requestFrom = req.header('client_name');
      const redisKey = `client-access-token-${requestFrom}`;
      const data = await this.cacheService.get(redisKey);
      if (data) {
        next();
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
