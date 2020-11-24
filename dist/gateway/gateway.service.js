"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const ip_resolver_service_1 = require("./ip-resolver.service");
const __1 = require("..");
const fetch_service_1 = require("../fetch/fetch.service");
let GatewayService = class GatewayService {
    constructor(ipResolverService, cacheService, fetchService) {
        this.ipResolverService = ipResolverService;
        this.cacheService = cacheService;
        this.fetchService = fetchService;
    }
    async execute(domain, { method = 'GET', headers = {}, qs = {}, body = '', userId: reqUserId = 0, token: optionToken = '', }) {
        const ip = this.ipResolverService.resolve(domain);
        const key = `client-access-token-${domain}`;
        console.log(key);
        let token = await this.cacheService.get(key);
        console.log('before contacting auth');
        console.log(token);
        if (!token) {
            const authIp = this.ipResolverService.resolve('auth');
            const clientId = 'c93a606d-7fac-4851-85ec-dd5ae0fe8fc9';
            const userId = "1";
            const responseType = 'code';
            const redirectUri = 'http://localhost:8081/api/v1/authorization/oauth/token';
            const query = `client_id=${clientId}&user_id=${userId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
            const url = `${authIp}authorization/oauth/authorize`;
            const response = await this.fetchService.execute(url, {
                qs: {
                    client_id: clientId,
                    user_id: userId,
                    response_type: responseType,
                    redirect_uri: redirectUri,
                }
            });
            const { code: responseCode, data: { code = null, } = {}, } = response;
            if (responseCode !== 200 || !code) {
                throw new common_1.HttpException("Could not generate valid authorization code!", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const body = {
                client_id: clientId,
                secret: 'lLuxT04mHwEzvqNYMkUfUXBMNad0zZoqLxms6LIouUmpbz5WC7nCNMYXKcbzoJJa',
                code,
                grant_type: 'authorization_code',
                redirect_uri: 'localhost:8001',
            };
            const tokenResponse = await this.fetchService.execute(`${authIp}authorization/oauth/token`, {
                method: 'POST',
                body,
            });
            const { code: tokenResponseCode, data: { access_token: { value: accessToken, }, } = {} } = tokenResponse;
            if (responseCode !== 200 || !accessToken) {
                throw new common_1.HttpException("Could not generate valid access token!", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            token = await this.cacheService.set(key, accessToken);
        }
        console.log('after storing ');
        console.log(token);
    }
};
GatewayService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [ip_resolver_service_1.IpResolverService,
        __1.CacheService,
        fetch_service_1.FetchService])
], GatewayService);
exports.GatewayService = GatewayService;
//# sourceMappingURL=gateway.service.js.map