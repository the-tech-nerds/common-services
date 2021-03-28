/* eslint-disable */
import {
  Repository,
  FindConditions,
  SelectQueryBuilder,
  Like,
  ObjectLiteral,
  getConnection,
} from 'typeorm';
import { performance } from 'perf_hooks';
import { ServiceUnavailableException } from '@nestjs/common';
import { PaginateQuery } from './decorator';
import { buildPaginator } from './cursor-pagination';
import { fixParameterOrder } from './cursor-pagination/utils';

type Column<T> = Extract<keyof T, string>;
type Order<T> = [Column<T>, 'ASC' | 'DESC'];
type SortBy<T> = Order<T>[];

export class Paginated<T> {
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

export async function paginate<T>(
  query: PaginateQuery,
  repo: Repository<T> | SelectQueryBuilder<T>,
  entity: any,
  config: PaginateConfig<T>,
): Promise<Paginated<T>> {
  const t1 = performance.now();

  const hasPageQuery = query.page !== undefined;
  let page = query.page || 1;
  let prevCursor = query.prevCursor || undefined;
  let nextCursor = query.nextCursor || undefined;
  const limit = query.limit || config.defaultLimit || 20;
  const sortBy = [] as SortBy<T>;
  const { search } = query;

  function isEntityKey(
    sortableColumns: Column<T>[],
    column: string,
  ): column is Column<T> {
    return !!sortableColumns.find(c => c === column);
  }

  const { sortableColumns } = config;
  if (config.sortableColumns.length < 1)
    throw new ServiceUnavailableException();

  if (query.sortBy) {
    for (const order of query.sortBy) {
      if (
        isEntityKey(sortableColumns, order[0]) &&
        ['ASC', 'DESC'].includes(order[1])
      ) {
        sortBy.push(order as Order<T>);
      }
    }
  }
  const hasIdCol = sortBy.some(sort =>
    (Object.values(sort) as any).includes('id'),
  );
  if (!sortBy.length || !hasIdCol) {
    sortBy.push(...(config.defaultSortBy || [[sortableColumns[0], 'ASC']]));
  }

  if (page < 1) page = 1;

  let queryBuilder: SelectQueryBuilder<T>;

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner('slave');

  const { tableName } = connection.getRepository(entity).metadata;

  if (repo instanceof Repository) {
    queryBuilder = repo.createQueryBuilder(tableName);

    for (const order of sortBy) {
      queryBuilder.addOrderBy(`${tableName}.${order[0]}`, order[1]);
    }
  } else {
    queryBuilder = repo;

    for (const order of sortBy) {
      queryBuilder.addOrderBy(`${repo.alias}.${order[0]}`, order[1]);
    }
  }

  const where: ObjectLiteral[] = [];
  if (search && config.searchableColumns) {
    for (const column of config.searchableColumns) {
      where.push({ [column]: Like(`%${search}%`), ...config.where });
    }
  }

  let countQueryBuilder: SelectQueryBuilder<T> = queryBuilder.clone();

  let minimum = 0;
  let maximum = 0;
  let totalCount = 0;

  if (hasPageQuery) {
    const uniqueRow = `${tableName}.id`;
    countQueryBuilder = countQueryBuilder
      .where(where)
      .select(
        `min(${uniqueRow}) as min, max(${uniqueRow}) as max, COUNT(${uniqueRow}) as count`,
      );

    const [query, params] = countQueryBuilder.getQueryAndParameters();
    const [{ min, max, count }] = await queryRunner.query(
      query,
      fixParameterOrder(params, where),
    );

    minimum = Number(min);
    maximum = Number(max);
    totalCount = Number(count);
  }

  const convertedQueryBuilder = <SelectQueryBuilder<any>>queryBuilder;
  const sortByColumns = sortBy.map(order => order[0]);
  const order = <any>sortBy[0][1];

  const paginator = buildPaginator({
    entity,
    paginationKeys: sortByColumns,
    queryRunner: queryRunner,
    query: {
      limit,
      order,
      afterCursor: nextCursor ?? undefined,
      beforeCursor: prevCursor ?? undefined,
      where,
      page: hasPageQuery ? page : null,
      min: Number(minimum),
      max: Number(maximum),
    },
  });

  const { data, cursor } = await paginator.paginate(convertedQueryBuilder);
  queryRunner.release();

  prevCursor = cursor.beforeCursor ?? undefined;
  nextCursor = cursor.afterCursor ?? undefined;

  const options = `&limit=${limit}${sortBy
    .map(order => `&sortBy=${order.join(':')}`)
    .join('')}${search ? `&search=${search}` : ''}`;

  const buildLink = (p: number): string =>
    `${hasPageQuery ? `?page=${p}` : '?'}${options}`;

  const totalPages = Math.ceil(totalCount / limit);

  const results: Paginated<T> = {
    results: data,
    meta: {
      itemsPerPage: limit,
      currentPage: hasPageQuery ? page : undefined,
      sortBy,
      search,
      totalPages: hasPageQuery ? totalPages : undefined,
      totalResults: hasPageQuery ? Number(totalCount) : undefined,
      time: `${Math.round(performance.now() - t1)}ms`,
    },
    links: {
      first: hasPageQuery
        ? page == 1
          ? undefined
          : buildLink(1)
        : buildLink(page),
      previous: hasPageQuery
        ? page <= 1
          ? undefined
          : `${buildLink(page - 1)}`
        : prevCursor
        ? `${buildLink(page + 1)}&previousCursor=${prevCursor}`
        : undefined,
      current: hasPageQuery ? buildLink(page) : undefined,
      next: hasPageQuery
        ? page + 1 > totalPages
          ? undefined
          : `${buildLink(page + 1)}`
        : nextCursor
        ? `${buildLink(page + 1)}&nextCursor=${nextCursor}`
        : undefined,
      last:
        page === totalPages || !hasPageQuery
          ? undefined
          : `${buildLink(totalPages)}`,
    },
  };

  return Object.assign(new Paginated<T>(), results);
}
