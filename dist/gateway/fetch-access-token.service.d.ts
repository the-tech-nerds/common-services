import { FetchService } from '../fetch/fetch.service';
export declare class FetchAccessTokenService {
    private readonly fetchService;
    constructor(fetchService: FetchService);
    execute(accessCode?: any, authIp?: any, data?: any): Promise<string>;
}
