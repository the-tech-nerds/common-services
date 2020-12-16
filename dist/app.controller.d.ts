import { AppService } from './app.service';
import { CacheService } from "./cache/cache.service";
export declare class AppController {
    private readonly appService;
    private readonly cacheService;
    constructor(appService: AppService, cacheService: CacheService);
    getHello(): Promise<any>;
}
