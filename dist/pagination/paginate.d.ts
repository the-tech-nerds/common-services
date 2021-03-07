import { Repository, FindConditions, SelectQueryBuilder } from 'typeorm';
import { PaginateQuery } from './decorator';
declare type Column<T> = Extract<keyof T, string>;
declare type Order<T> = [Column<T>, 'ASC' | 'DESC'];
declare type SortBy<T> = Order<T>[];
export declare class Paginated<T> {
    results: any[];
    meta: {
        itemsPerPage: number;
        currentPage: number | undefined;
        sortBy: SortBy<T>;
        search?: string;
        totalPages: number | undefined;
        totalResults: number | undefined;
        time: string;
    };
    links: {
        first?: string;
        previous?: string;
        current: string | undefined;
        next?: string;
        last?: string;
    };
}
export interface PaginateConfig<T> {
    sortableColumns: Column<T>[];
    searchableColumns?: Column<T>[];
    maxLimit?: number;
    defaultSortBy?: SortBy<T>;
    defaultLimit?: number;
    where?: FindConditions<T>;
    queryBuilder?: SelectQueryBuilder<T>;
}
export declare function paginate<T>(query: PaginateQuery, repo: Repository<T> | SelectQueryBuilder<T>, entity: any, config: PaginateConfig<T>): Promise<Paginated<T>>;
export {};
