import { IpResolverService } from './ip-resolver.service';
import { CacheService } from '..';
import { FetchService } from '../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { FetchAccessCodeService } from './fetch-access-code.service';
import { FetchAccessTokenService } from './fetch-access-token.service';
export interface GatewayRequest {
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    path?: string;
    headers?: {
        [s: string]: string;
    };
    qs?: {
        [s: string]: string | Array<string | number>;
    };
    body?: any;
    userId?: number;
    token?: string;
}
export declare class GatewayService {
    private readonly ipResolverService;
    private readonly cacheService;
    private readonly fetchService;
    private readonly configService;
    private readonly fetchAccessCodeService;
    private readonly fetchAccessTokenService;
    constructor(ipResolverService: IpResolverService, cacheService: CacheService, fetchService: FetchService, configService: ConfigService, fetchAccessCodeService: FetchAccessCodeService, fetchAccessTokenService: FetchAccessTokenService);
    prepareFetchTokenData(): {
        client_id: any;
        user_id: string;
        response_type: string;
        redirect_uri: string;
        client_secret: any;
        grant_type: string;
    };
    execute(domain: any, gatewayRequest: GatewayRequest): Promise<any>;
}
