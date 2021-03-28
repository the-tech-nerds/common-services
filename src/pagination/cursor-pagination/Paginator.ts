import {
  Brackets,
  ObjectType,
  OrderByCondition,
  SelectQueryBuilder,
  WhereExpression,
  ObjectLiteral,
  QueryRunner,
  getConnection,
} from 'typeorm';

import { RelationIdLoader } from 'typeorm/query-builder/relation-id/RelationIdLoader';
import { RelationIdMetadataToAttributeTransformer } from 'typeorm/query-builder/relation-id/RelationIdMetadataToAttributeTransformer';
import { RelationCountLoader } from 'typeorm/query-builder/relation-count/RelationCountLoader';
import { RelationCountMetadataToAttributeTransformer } from 'typeorm/query-builder/relation-count/RelationCountMetadataToAttributeTransformer';
import { RawSqlResultsToEntityTransformer } from '../raw-sql-results-to-entity';
import { QueryResultCacheOptions } from 'typeorm/cache/QueryResultCacheOptions';

import {
  atob,
  btoa,
  encodeByType,
  decodeByType,
  pascalToUnderscore,
} from './utils';

export type Order = 'ASC' | 'DESC';

export type EscapeFn = (name: string) => string;

interface CursorParam {
  [key: string]: any;
}

export interface Cursor {
  beforeCursor: string | null;
  afterCursor: string | null;
}

export interface PagingResult<Entity> {
  data: Entity[];
  cursor: Cursor;
}

export default class Paginator<Entity> {
  private afterCursor: string | null = null;

  private beforeCursor: string | null = null;

  private nextAfterCursor: string | null = null;

  private nextBeforeCursor: string | null = null;

  private alias: string = pascalToUnderscore(this.entity.name);

  private where: ObjectLiteral[] = [];

  private limit = 100;

  private order: Order = 'DESC';

  private page: number | null = null;

  private min = 0;

  private max = 0;

  public constructor(
    private entity: ObjectType<Entity>,
    private paginationKeys: Extract<keyof Entity, string>[],
    private queryRunner: QueryRunner | null = getConnection().createQueryRunner(),
  ) {}

  public setAlias(alias: string): void {
    this.alias = alias;
  }

  public setAfterCursor(cursor: string): void {
    this.afterCursor = cursor;
  }

  public setBeforeCursor(cursor: string): void {
    this.beforeCursor = cursor;
  }

  public setLimit(limit: number): void {
    this.limit = limit;
  }

  public setOrder(order: Order): void {
    this.order = order;
  }

  public setWhere(where: ObjectLiteral[]): void {
    this.where = where;
  }

  public setMin(min: number): void {
    this.min = min;
  }

  public setMax(max: number): void {
    this.max = max;
  }

  public setPage(page: number): void {
    this.page = page;
  }

  private fixParameterOrder(parameters: ObjectLiteral) {
    return [
      ...parameters.slice(0, this.where.length),
      ...parameters.slice(this.where.length, parameters.length - 1),
      parameters[parameters.length - 1],
    ];
  }

  public async paginate(
    builder: SelectQueryBuilder<Entity>,
  ): Promise<PagingResult<Entity>> {
    const entities: Entity[] = await this.runQueryAndGenerateEntities(builder);

    const hasMore = entities.length > this.limit;

    if (hasMore) {
      entities.splice(entities.length - 1, 1);
    }

    if (entities.length === 0) {
      return this.toPagingResult(entities);
    }

    if (!this.hasAfterCursor() && this.hasBeforeCursor()) {
      entities.reverse();
    }

    if (this.hasBeforeCursor() || hasMore) {
      this.nextAfterCursor = this.encode(entities[entities.length - 1]);
    }

    if (this.hasAfterCursor() || (hasMore && this.hasBeforeCursor())) {
      this.nextBeforeCursor = this.encode(entities[0]);
    }

    return this.toPagingResult(entities);
  }

  private getCursor(): Cursor {
    return {
      afterCursor: this.nextAfterCursor,
      beforeCursor: this.nextBeforeCursor,
    };
  }

  private appendPagingQuery(
    builder: SelectQueryBuilder<Entity>,
  ): SelectQueryBuilder<Entity> {
    const cursors: CursorParam = {};

    if (this.hasAfterCursor()) {
      Object.assign(cursors, this.decode(this.afterCursor as string));
    } else if (this.hasBeforeCursor()) {
      Object.assign(cursors, this.decode(this.beforeCursor as string));
    }

    if (this.page) {
      let cursorId = this.page;
      if (this.order === 'ASC') {
        cursorId = this.min + (this.page - 1) * this.limit - 1;
      } else {
        cursorId = this.max - (this.page - 1) * this.limit + 1;
      }
      Object.assign(cursors, { id: cursorId });
    }

    let cursorQuery: any = null;

    if (Object.keys(cursors).length > 0) {
      cursorQuery = new Brackets(where =>
        this.buildCursorQuery(where, cursors),
      );
    }

    builder.andWhere(
      new Brackets(qb => {
        qb.where(this.where);

        if (cursorQuery) {
          qb.andWhere(cursorQuery);
        }

        return qb;
      }),
    );

    builder.limit(this.limit + 1);
    builder.orderBy(this.buildOrder());

    return builder;
  }

  private async runQueryAndGenerateEntities(
    builder: SelectQueryBuilder<Entity>,
  ): Promise<Entity[]> {
    const builderWithPagingQuery = this.appendPagingQuery(builder);
    const [query, parameters]: [
      string,
      any,
    ] = builderWithPagingQuery.getQueryAndParameters();
    const { connection, expressionMap } = builderWithPagingQuery;
    const queryRunner = this.queryRunner || getConnection().createQueryRunner();
    const queryId = query + ' -- PARAMETERS: ' + JSON.stringify(parameters);
    const cacheOptions =
      typeof connection.options.cache === 'object'
        ? connection.options.cache
        : {};
    let savedQueryResultCacheOptions:
      | QueryResultCacheOptions
      | undefined = undefined;

    if (connection.queryResultCache) {
      savedQueryResultCacheOptions = await connection.queryResultCache.getFromCache(
        {
          identifier: expressionMap.cacheId,
          query: queryId,
          duration:
            expressionMap.cacheDuration ||
            cacheOptions.duration ||
            1000 * 60 * 20,
        },
        queryRunner,
      );
      if (
        savedQueryResultCacheOptions &&
        !connection.queryResultCache.isExpired(savedQueryResultCacheOptions)
      )
        return JSON.parse(savedQueryResultCacheOptions.result);
    }

    const rawResults = await queryRunner.query(
      query,
      this.fixParameterOrder(parameters),
    );
    const relationIdLoader = new RelationIdLoader(
      connection,
      queryRunner,
      expressionMap.relationIdAttributes,
    );
    const relationCountLoader = new RelationCountLoader(
      connection,
      queryRunner,
      expressionMap.relationCountAttributes,
    );
    const relationIdMetadataTransformer = new RelationIdMetadataToAttributeTransformer(
      expressionMap,
    );
    relationIdMetadataTransformer.transform();
    const relationCountMetadataTransformer = new RelationCountMetadataToAttributeTransformer(
      expressionMap,
    );
    relationCountMetadataTransformer.transform();

    const rawRelationIdResults = await relationIdLoader.load(rawResults);
    const rawRelationCountResults = await relationCountLoader.load(rawResults);
    const transformer = new RawSqlResultsToEntityTransformer(
      expressionMap,
      connection.driver,
      rawRelationIdResults,
      rawRelationCountResults,
      queryRunner,
    );
    const entities = transformer.transform(
      rawResults,
      expressionMap.mainAlias!,
    );

    if (connection.queryResultCache) {
      connection.queryResultCache.storeInCache(
        {
          identifier: expressionMap.cacheId,
          query: queryId,
          time: new Date().getTime(),
          duration:
            expressionMap.cacheDuration ||
            cacheOptions.duration ||
            1000 * 60 * 20,
          result: JSON.stringify(entities),
        },
        savedQueryResultCacheOptions,
        queryRunner,
      );
    }

    return entities;
  }

  private buildCursorQuery(where: WhereExpression, cursors: CursorParam): void {
    const operator = this.getOperator();
    const params: CursorParam = {};
    let query = '';
    this.paginationKeys.forEach(key => {
      if (key === 'id') {
        params[key] = cursors[key];
        where.orWhere(
          `${query}${this.alias}.${key} ${operator} :${key}`,
          params,
        );
        query = `${query}${this.alias}.${key} = :${key} AND `;
      }
    });
  }

  private getOperator(): string {
    if (this.hasAfterCursor()) {
      return this.order === 'ASC' ? '>' : '<';
    }

    if (this.hasBeforeCursor()) {
      return this.order === 'ASC' ? '<' : '>';
    }

    if (this.page) {
      return this.order === 'ASC' ? '>' : '<';
    }

    return '=';
  }

  private buildOrder(): OrderByCondition {
    let { order } = this;

    if (!this.hasAfterCursor() && this.hasBeforeCursor()) {
      order = this.flipOrder(order);
    }

    const orderByCondition: OrderByCondition = {};
    this.paginationKeys.forEach(key => {
      orderByCondition[`${this.alias}.${key}`] = order;
    });

    return orderByCondition;
  }

  private hasAfterCursor(): boolean {
    return this.afterCursor !== null;
  }

  private hasBeforeCursor(): boolean {
    return this.beforeCursor !== null;
  }

  private encode(entity: Entity): string {
    const payload = this.paginationKeys
      .map(key => {
        const type = this.getEntityPropertyType(key);
        const value = encodeByType(type, entity[key]);
        return `${key}:${value}`;
      })
      .join(',');

    return btoa(payload);
  }

  private decode(cursor: string): CursorParam {
    const cursors: CursorParam = {};
    const columns = atob(cursor).split(',');
    columns.forEach((column: any) => {
      const [key, raw] = column.split(':');
      const type = this.getEntityPropertyType(key);
      const value = decodeByType(type, raw);
      cursors[key] = value;
    });

    return cursors;
  }

  private getEntityPropertyType(key: string): string {
    return Reflect.getMetadata(
      'design:type',
      this.entity.prototype,
      key,
    ).name.toLowerCase();
  }

  private flipOrder(order: Order): Order {
    return order === 'ASC' ? 'DESC' : 'ASC';
  }

  private toPagingResult<Entity>(entities: Entity[]): PagingResult<Entity> {
    return {
      data: entities,
      cursor: this.getCursor(),
    };
  }
}
