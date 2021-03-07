"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.Paginated = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const cursor_pagination_1 = require("./cursor-pagination");
const { performance } = require('perf_hooks');
class Paginated {
}
exports.Paginated = Paginated;
async function paginate(query, repo, entity, config) {
    var _a, _b;
    const t1 = performance.now();
    console.log(query);
    const hasPageQuery = query.page !== undefined;
    let page = query.page || 1;
    let prevCursor = query.prevCursor || undefined;
    let nextCursor = query.nextCursor || undefined;
    const limit = query.limit || config.defaultLimit || 20;
    const sortBy = [];
    const { search } = query;
    console.log(page, limit);
    function isEntityKey(sortableColumns, column) {
        return !!sortableColumns.find((c) => c === column);
    }
    const { sortableColumns } = config;
    if (config.sortableColumns.length < 1)
        throw new common_1.ServiceUnavailableException();
    if (query.sortBy) {
        for (const order of query.sortBy) {
            if (isEntityKey(sortableColumns, order[0]) && ['ASC', 'DESC'].includes(order[1])) {
                sortBy.push(order);
            }
        }
    }
    const hasIdCol = sortBy.some(sort => Object.values(sort).includes('id'));
    if (!sortBy.length || !hasIdCol) {
        sortBy.push(...(config.defaultSortBy || [[sortableColumns[0], 'ASC']]));
    }
    if (page < 1)
        page = 1;
    let queryBuilder;
    const tableName = typeorm_1.getManager().getRepository(entity).metadata.tableName;
    if (repo instanceof typeorm_1.Repository) {
        queryBuilder = repo
            .createQueryBuilder(tableName);
        for (const order of sortBy) {
            queryBuilder.addOrderBy(`${tableName}.${order[0]}`, order[1]);
        }
    }
    else {
        queryBuilder = repo;
        for (const order of sortBy) {
            queryBuilder.addOrderBy(`${repo.alias}.${order[0]}`, order[1]);
        }
    }
    const where = [];
    if (search && config.searchableColumns) {
        for (const column of config.searchableColumns) {
            where.push(Object.assign({ [column]: typeorm_1.Like(`%${search}%`) }, config.where));
        }
    }
    const countQueryBuilder = queryBuilder.clone();
    let minimum = 0, maximum = 0, totalCount = 0;
    if (hasPageQuery) {
        const { min, max, count } = await countQueryBuilder.where(where)
            .select(`min(id) as min, max(id) as max, COUNT(${tableName}.id) as count`).getRawOne();
        minimum = min;
        maximum = max;
        totalCount = count;
    }
    const convertedQueryBuilder = (queryBuilder);
    const sortByColumns = sortBy.map(order => order[0]);
    const order = sortBy[0][1];
    const paginator = cursor_pagination_1.buildPaginator({
        entity: entity,
        paginationKeys: sortByColumns,
        query: {
            limit: limit,
            order: order,
            afterCursor: nextCursor !== null && nextCursor !== void 0 ? nextCursor : undefined,
            beforeCursor: prevCursor !== null && prevCursor !== void 0 ? prevCursor : undefined,
            where: where,
            page: hasPageQuery ? page : null,
            min: Number(minimum),
            max: Number(maximum),
        }
    });
    const { data, cursor } = await paginator.paginate(convertedQueryBuilder);
    prevCursor = (_a = cursor.beforeCursor) !== null && _a !== void 0 ? _a : undefined;
    nextCursor = (_b = cursor.afterCursor) !== null && _b !== void 0 ? _b : undefined;
    const options = `&limit=${limit}${sortBy.map((order) => `&sortBy=${order.join(':')}`).join('')}${search ? `&search=${search}` : ''}`;
    const buildLink = (p) => `${hasPageQuery ? `?page=${p}` : '?'}${options}`;
    const totalPages = Math.ceil(totalCount / limit);
    const results = {
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
            first: hasPageQuery ? page == 1 ? undefined : buildLink(1) : buildLink(page),
            previous: page <= 1 ? undefined : `${buildLink(page - 1)}`,
            current: hasPageQuery ? buildLink(page) : undefined,
            next: hasPageQuery ? page + 1 > totalPages ? undefined : `${buildLink(page + 1)}`
                : nextCursor ? `${buildLink(page + 1)}&nextCursor=${nextCursor}` : undefined,
            last: page === totalPages || !hasPageQuery ? undefined : `${buildLink(totalPages)}`,
        },
    };
    return Object.assign(new Paginated(), results);
}
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map