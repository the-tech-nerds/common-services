import { Cache } from 'cache-manager';
export declare class CacheService {
    private readonly cache;
    constructor(cache: Cache);
    get(key: any): Promise<any>;
    set(key: any, value: any, ttl?: number): Promise<any>;
}
