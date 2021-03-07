"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const utils_1 = require("./utils");
class Paginator {
    constructor(entity, paginationKeys) {
        this.entity = entity;
        this.paginationKeys = paginationKeys;
        this.afterCursor = null;
        this.beforeCursor = null;
        this.nextAfterCursor = null;
        this.nextBeforeCursor = null;
        this.alias = utils_1.pascalToUnderscore(this.entity.name);
        this.where = [];
        this.limit = 100;
        this.order = 'DESC';
        this.page = null;
        this.min = 0;
        this.max = 0;
    }
    setAlias(alias) {
        this.alias = alias;
    }
    setAfterCursor(cursor) {
        this.afterCursor = cursor;
    }
    setBeforeCursor(cursor) {
        this.beforeCursor = cursor;
    }
    setLimit(limit) {
        this.limit = limit;
    }
    setOrder(order) {
        this.order = order;
    }
    setWhere(where) {
        this.where = where;
    }
    setMin(min) {
        this.min = min;
    }
    setMax(max) {
        this.max = max;
    }
    setPage(page) {
        this.page = page;
    }
    async paginate(builder) {
        const entities = await this.appendPagingQuery(builder).getMany();
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
    getCursor() {
        return {
            afterCursor: this.nextAfterCursor,
            beforeCursor: this.nextBeforeCursor,
        };
    }
    appendPagingQuery(builder) {
        const cursors = {};
        if (this.hasAfterCursor()) {
            Object.assign(cursors, this.decode(this.afterCursor));
        }
        else if (this.hasBeforeCursor()) {
            Object.assign(cursors, this.decode(this.beforeCursor));
        }
        if (this.page) {
            let cursorId = this.page;
            if (this.order === 'ASC') {
                cursorId = this.min + ((this.page - 1) * this.limit) - 1;
            }
            else {
                cursorId = this.max - ((this.page - 1) * this.limit) + 1;
            }
            Object.assign(cursors, { id: cursorId });
        }
        let cursorQuery = null;
        if (Object.keys(cursors).length > 0) {
            cursorQuery = new typeorm_1.Brackets((where) => this.buildCursorQuery(where, cursors));
        }
        builder.where(new typeorm_1.Brackets(qb => qb.where(this.where)));
        if (cursorQuery) {
            builder.andWhere(cursorQuery);
        }
        builder.take(this.limit + 1);
        builder.orderBy(this.buildOrder());
        builder.cache(60 * 5 * 1000);
        return builder;
    }
    buildCursorQuery(where, cursors) {
        const operator = this.getOperator();
        const params = {};
        let query = '';
        this.paginationKeys.forEach((key) => {
            if (key === 'id') {
                params[key] = cursors[key];
                where.orWhere(`${query}${this.alias}.${key} ${operator} :${key}`, params);
                query = `${query}${this.alias}.${key} = :${key} AND `;
            }
        });
    }
    getOperator() {
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
    buildOrder() {
        let { order } = this;
        if (!this.hasAfterCursor() && this.hasBeforeCursor()) {
            order = this.flipOrder(order);
        }
        const orderByCondition = {};
        this.paginationKeys.forEach((key) => {
            orderByCondition[`${this.alias}.${key}`] = order;
        });
        return orderByCondition;
    }
    hasAfterCursor() {
        return this.afterCursor !== null;
    }
    hasBeforeCursor() {
        return this.beforeCursor !== null;
    }
    encode(entity) {
        const payload = this.paginationKeys.map((key) => {
            const type = this.getEntityPropertyType(key);
            const value = utils_1.encodeByType(type, entity[key]);
            return `${key}:${value}`;
        }).join(',');
        return utils_1.btoa(payload);
    }
    decode(cursor) {
        const cursors = {};
        const columns = utils_1.atob(cursor).split(',');
        columns.forEach((column) => {
            const [key, raw] = column.split(':');
            const type = this.getEntityPropertyType(key);
            const value = utils_1.decodeByType(type, raw);
            cursors[key] = value;
        });
        return cursors;
    }
    getEntityPropertyType(key) {
        return Reflect.getMetadata('design:type', this.entity.prototype, key).name.toLowerCase();
    }
    flipOrder(order) {
        return order === 'ASC'
            ? 'DESC'
            : 'ASC';
    }
    toPagingResult(entities) {
        return {
            data: entities,
            cursor: this.getCursor(),
        };
    }
}
exports.default = Paginator;
//# sourceMappingURL=Paginator.js.map