import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CacheService } from '../..';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(private readonly cacheService: CacheService) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(context);
    return true;
  }
}
