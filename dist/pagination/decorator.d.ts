export interface PaginateQuery {
    page?: number;
    limit?: number;
    prevCursor?: string | undefined;
    nextCursor?: string | undefined;
    sortBy?: [string, string][];
    search?: string;
    path: string;
}
export declare const Paginate: (...dataOrPipes: unknown[]) => ParameterDecorator;
