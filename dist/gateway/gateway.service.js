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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const ip_resolver_service_1 = require("./ip-resolver.service");
const __1 = require("..");
const fetch_service_1 = require("../fetch/fetch.service");
const config_1 = require("@nestjs/config");
const fetch_access_code_service_1 = require("./fetch-access-code.service");
const fetch_access_token_service_1 = require("./fetch-access-token.service");
const core_1 = require("@nestjs/core");
const customLogger_service_1 = require("../logger/customLogger.service");
let GatewayService = class GatewayService {
    constructor(ipResolverService, cacheService, fetchService, configService, fetchAccessCodeService, fetchAccessTokenService, loggerService, request) {
        this.ipResolverService = ipResolverService;
        this.cacheService = cacheService;
        this.fetchService = fetchService;
        this.configService = configService;
        this.fetchAccessCodeService = fetchAccessCodeService;
        this.fetchAccessTokenService = fetchAccessTokenService;
        this.loggerService = loggerService;
        this.request = request;
    }
    prepareFetchTokenData(authIp) {
        const clientId = this.configService.get('app_client_id');
        const clientSecret = this.configService.get('app_client_secret');
        if (!clientId || !clientSecret) {
            throw new common_1.HttpException('Client id and client secret are required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!authIp) {
            throw new common_1.HttpException('Auth Service Ip is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const userId = '1';
        const responseType = 'code';
        const redirectUri = `${authIp}/api/v1/authorization/oauth/token`;
        const grantType = 'authorization_code';
        return {
            client_id: clientId,
            user_id: userId,
            response_type: responseType,
            redirect_uri: redirectUri,
            client_secret: clientSecret,
            grant_type: grantType,
        };
    }
    async execute(domain, gatewayRequest) {
        const ip = this.ipResolverService.resolve(domain, process.env.ENV);
        const appName = this.configService.get('app_name');
        const key = `client-access-token-${appName}`;
        let token = await this.cacheService.get(key);
        if (!token) {
            const authIp = await this.ipResolverService.resolve('auth', process.env.ENV);
            const data = this.prepareFetchTokenData(authIp);
            const accessCode = await this.fetchAccessCodeService.execute(authIp, data);
            const accessToken = await this.fetchAccessTokenService.execute(accessCode, authIp, data);
            token = await this.cacheService.set(key, accessToken);
        }
        try {
            const { path, method, headers = {}, token: userAccessToken = null, body = undefined, qs = {}, } = gatewayRequest;
            const url = `${ip}${path}`;
            const requestHeaders = this.request.headers;
            const accessTokenFromRequestHeader = requestHeaders.access_token || undefined;
            const userId = requestHeaders.user_id || null;
            if (accessTokenFromRequestHeader && userId) {
                const token = await this.cacheService.get(`user-token-${userId}`);
                if (token !== accessTokenFromRequestHeader) {
                    throw new common_1.UnauthorizedException();
                }
            }
            const fetchedResponse = await this.fetchService.execute(url, {
                method,
                headers: Object.assign(Object.assign({}, headers), { client_name: appName, client_access_token: token, access_token: userAccessToken !== null && userAccessToken !== void 0 ? userAccessToken : accessTokenFromRequestHeader, Authorization: `Bearer ${accessTokenFromRequestHeader}` }),
                body: body ? body : undefined,
                qs,
            });
            return fetchedResponse;
        }
        catch (e) {
            this.loggerService.error(`Service Name: ${domain}. Response :: ${e.toString()}`);
            throw e;
        }
    }
};
GatewayService = __decorate([
    common_1.Injectable({ scope: common_1.Scope.REQUEST }),
    __param(7, common_1.Inject(core_1.REQUEST)),
    __metadata("design:paramtypes", [ip_resolver_service_1.IpResolverService,
        __1.CacheService,
        fetch_service_1.FetchService,
        config_1.ConfigService,
        fetch_access_code_service_1.FetchAccessCodeService,
        fetch_access_token_service_1.FetchAccessTokenService,
        customLogger_service_1.CustomLoggerService,
        Request])
], GatewayService);
exports.GatewayService = GatewayService;
//# sourceMappingURL=gateway.service.js.map