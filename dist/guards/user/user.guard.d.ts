import { ExecutionContext } from '@nestjs/common';
import { CacheService } from '../..';
declare const UserGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class UserGuard extends UserGuard_base {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
export {};
