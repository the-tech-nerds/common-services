import { ObjectType, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
export declare type Order = 'ASC' | 'DESC';
export declare type EscapeFn = (name: string) => string;
export interface Cursor {
    beforeCursor: string | null;
    afterCursor: string | null;
}
export interface PagingResult<Entity> {
    data: Entity[];
    cursor: Cursor;
}
export default class Paginator<Entity> {
    private entity;
    private paginationKeys;
    private afterCursor;
    private beforeCursor;
    private nextAfterCursor;
    private nextBeforeCursor;
    private alias;
    private where;
    private limit;
    private order;
    private page;
    private min;
    private max;
    constructor(entity: ObjectType<Entity>, paginationKeys: Extract<keyof Entity, string>[]);
    setAlias(alias: string): void;
    setAfterCursor(cursor: string): void;
    setBeforeCursor(cursor: string): void;
    setLimit(limit: number): void;
    setOrder(order: Order): void;
    setWhere(where: ObjectLiteral[]): void;
    setMin(min: number): void;
    setMax(max: number): void;
    setPage(page: number): void;
    paginate(builder: SelectQueryBuilder<Entity>): Promise<PagingResult<Entity>>;
    private getCursor;
    private appendPagingQuery;
    private buildCursorQuery;
    private getOperator;
    private buildOrder;
    private hasAfterCursor;
    private hasBeforeCursor;
    private encode;
    private decode;
    private getEntityPropertyType;
    private flipOrder;
    private toPagingResult;
}
