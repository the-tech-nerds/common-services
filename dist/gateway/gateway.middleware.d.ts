import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { GatewayService } from "./gateway.service";
export declare class GatewayMiddleware implements NestMiddleware {
    private readonly gatewayService;
    constructor(gatewayService: GatewayService);
    use(req: Request, res: Response, next: Function): void;
}
