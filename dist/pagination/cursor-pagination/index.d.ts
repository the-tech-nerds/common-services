import { ObjectType, ObjectLiteral } from 'typeorm';
import Paginator, { Order, Cursor, PagingResult } from './Paginator';
export { Order, Cursor, PagingResult };
export interface PagingQuery {
    afterCursor?: string;
    beforeCursor?: string;
    limit?: number;
    order?: Order;
    where?: ObjectLiteral[];
    page?: number | null;
    min?: number;
    max?: number;
}
export interface PaginationOptions<Entity> {
    entity: ObjectType<Entity>;
    alias?: string;
    query?: PagingQuery;
    paginationKeys?: Extract<keyof Entity, string>[];
}
export declare function buildPaginator<Entity>(options: PaginationOptions<Entity>): Paginator<Entity>;
