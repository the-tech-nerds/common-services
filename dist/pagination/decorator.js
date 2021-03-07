"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginate = void 0;
const common_1 = require("@nestjs/common");
exports.Paginate = common_1.createParamDecorator((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const { query } = request;
    const path = `${request.protocol}://${request.get('host')}${request.baseUrl}${request.path}`;
    const sortBy = [];
    if (query.sortBy) {
        const params = !Array.isArray(query.sortBy) ? [query.sortBy] : query.sortBy;
        for (const param of params) {
            if (typeof param === 'string') {
                const items = param.split(':');
                if (items.length === 2) {
                    sortBy.push(items);
                }
            }
        }
    }
    return {
        page: query.page ? parseInt(query.page.toString(), 10) : undefined,
        limit: query.limit ? parseInt(query.limit.toString(), 10) : undefined,
        prevCursor: query.prevCursor ? query.prevCursor.toString() : undefined,
        nextCursor: query.nextCursor ? query.nextCursor.toString() : undefined,
        sortBy: sortBy.length ? sortBy : undefined,
        search: query.search ? query.search.toString() : undefined,
        path,
    };
});
//# sourceMappingURL=decorator.js.map