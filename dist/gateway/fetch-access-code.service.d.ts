import { FetchService } from '../fetch/fetch.service';
export declare class FetchAccessCodeService {
    private readonly fetchService;
    constructor(fetchService: FetchService);
    execute(authIp: any, data: any): Promise<string>;
}
