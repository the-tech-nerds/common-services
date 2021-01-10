export interface Request {
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: {
        [s: string]: string;
    };
    qs?: {
        [s: string]: string | Array<string | number>;
    };
    body?: any;
    userId?: number;
    domain?: string;
    hosts?: string;
    token?: string;
}
export declare class FetchService {
    execute(path: string, request: Request): Promise<any>;
}
