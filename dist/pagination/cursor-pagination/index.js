"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginator = void 0;
const Paginator_1 = require("./Paginator");
function buildPaginator(options) {
    const { entity, query = {}, alias = entity.name.toLowerCase(), paginationKeys = ['id'], } = options;
    const paginator = new Paginator_1.default(entity, paginationKeys);
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
exports.buildPaginator = buildPaginator;
//# sourceMappingURL=index.js.map