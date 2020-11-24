import { IpResolverService } from "./ip-resolver.service";
import { CacheService } from "..";
import { FetchService } from "../fetch/fetch.service";
export declare class GatewayService {
    private readonly ipResolverService;
    private readonly cacheService;
    private readonly fetchService;
    constructor(ipResolverService: IpResolverService, cacheService: CacheService, fetchService: FetchService);
    execute(domain: any, { method, headers, qs, body, userId: reqUserId, token: optionToken, }: {
        method?: string;
        headers?: {};
        qs?: {};
        body?: string;
        userId?: number;
        token?: string;
    }): Promise<void>;
}
