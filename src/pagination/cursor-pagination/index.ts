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

export function buildPaginator<Entity>(
  options: PaginationOptions<Entity>,
): Paginator<Entity> {
  const {
    entity,
    query = {},
    alias = entity.name.toLowerCase(),
    paginationKeys = ['id' as any],
  } = options;

  const paginator = new Paginator(entity, paginationKeys);

  paginator.setAlias(alias);

  if (query.afterCursor) {
    paginator.setAfterCursor(query.afterCursor);
  }

  if (query.beforeCursor) {
    paginator.setBeforeCursor(query.beforeCursor);
  }

  if (query.limit) {
    paginator.setLimit(query.limit);
  }

  if (query.order) {
    paginator.setOrder(query.order);
  }

  if (query.where) {
    paginator.setWhere(query.where);
  }

  if (query.page) {
    paginator.setPage(query.page);
  }

  if (query.min) {
    paginator.setMin(query.min);
  }

  if (query.max) {
    paginator.setMax(query.max);
  }

  return paginator;
}
