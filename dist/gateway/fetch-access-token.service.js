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
exports.FetchAccessTokenService = void 0;
const common_1 = require("@nestjs/common");
const fetch_service_1 = require("../fetch/fetch.service");
let FetchAccessTokenService = class FetchAccessTokenService {
    constructor(fetchService) {
        this.fetchService = fetchService;
    }
    async execute(accessCode = null, authIp = null, data = null) {
        if (!accessCode || !authIp || !data) {
            throw new common_1.HttpException('Invalid data provided to fetch access token', common_1.HttpStatus.BAD_REQUEST);
        }
        const body = {
            client_id: data.client_id,
            secret: data.client_secret,
            code: accessCode,
            grant_type: data.grant_type,
            redirect_uri: data.redirect_uri,
        };
        const tokenResponse = await this.fetchService.execute(`${authIp}/api/v1/authorization/oauth/token`, {
            method: 'POST',
            body,
        });
        const { code: tokenResponseCode, data: { access_token: { value: accessToken } } = {}, } = tokenResponse;
        if (tokenResponseCode !== 200 || !accessToken) {
            throw new common_1.HttpException('Could not generate valid access token!', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return accessToken;
    }
};
FetchAccessTokenService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [fetch_service_1.FetchService])
], FetchAccessTokenService);
exports.FetchAccessTokenService = FetchAccessTokenService;
//# sourceMappingURL=fetch-access-token.service.js.map