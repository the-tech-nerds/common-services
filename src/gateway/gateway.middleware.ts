import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import {GatewayService} from "./gateway.service";

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(private readonly gatewayService: GatewayService) {
  }
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');

    // ui-service -> authrozation code
    // redis

    //

    // req header -> authorization_code
    // no tokens ?

    res.send("Unauthorized");
    next();
  }
}