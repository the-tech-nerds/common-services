import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CacheService } from '..';
export declare class GatewayMiddleware implements NestMiddleware {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    use(req: Request, res: Response, next: any): Promise<void>;
}
