import { Cache } from 'cache-manager';
export declare class CacheService {
    private readonly cache;
    constructor(cache: Cache);
    get(key: any): Promise<void>;
    set(key: any, value: any): Promise<void>;
}
