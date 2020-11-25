"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchService = void 0;
const common_1 = require("@nestjs/common");
const queryString = require("query-string");
const fetch = require("isomorphic-fetch");
const debug = require("debug");
class FetchService {
    async execute(path, request) {
        const { method = 'GET', headers = {}, qs = {}, body = '', userId: reqUserId = 0, token: optionToken = '', domain = '', } = request || {};
        if (!path) {
            throw new common_1.HttpException('Specific path is required to execute a fetch call', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const query = qs && Object.keys(qs).length > 0
            ? queryString.stringify(Object.assign({}, qs)).replace(/%2C/g, ',')
            : '';
        const url = `${path}?${query}`;
        const requestHeaders = optionToken
            ? Object.assign(Object.assign({}, headers), { access_token: optionToken }) : headers;
        let startTime;
        if (process.env.NODE_ENV === 'development') {
            startTime = Date.now();
        }
        const resp = await fetch(url, {
            method,
            headers: Object.assign({ 'Content-Type': 'application/json', userId: reqUserId }, requestHeaders),
            body: body ? JSON.stringify(body) : undefined,
            cache: 'no-cache',
            redirect: 'follow',
            referrer: domain.length ? domain : 'no-referrer',
        });
        const responseTime = `${Date.now() - startTime || 0}ms`;
        const log = debug('fetch');
        if (process.env.NODE_ENV === 'development') {
            log(`[fetchService] ${method.toUpperCase()} ${url}\n  payload: ${body ? JSON.stringify(body, null, 2) : '{}'}\n  response: ${resp.status} ${resp.ok ? '' : resp.statusText}\n  took ${responseTime}`);
        }
        if (!resp.ok) {
            throw new common_1.HttpException(`Failed making ${method} request to ${path}: ${await resp.json()}`, resp.status);
        }
        return resp.json();
    }
}
exports.FetchService = FetchService;
//# sourceMappingURL=fetch.service.js.map