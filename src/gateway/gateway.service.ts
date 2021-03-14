import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { IpResolverService } from './ip-resolver.service';
import { CacheService } from '..';
import { FetchService } from '../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { FetchAccessCodeService } from './fetch-access-code.service';
import { FetchAccessTokenService } from './fetch-access-token.service';
import { REQUEST } from '@nestjs/core';
import { CustomLoggerService } from '../logger/customLogger.service';

export interface GatewayRequest {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  path?: string;
  headers?: { [s: string]: string };
  qs?: { [s: string]: string | Array<string | number> };
  body?: any;
  userId?: number;
  token?: string;
}

@Injectable({ scope: Scope.REQUEST })
export class GatewayService {
  constructor(
    private readonly ipResolverService: IpResolverService,
    private readonly cacheService: CacheService,
    private readonly fetchService: FetchService,
    private readonly configService: ConfigService,
    private readonly fetchAccessCodeService: FetchAccessCodeService,
    private readonly fetchAccessTokenService: FetchAccessTokenService,
    private readonly loggerService: CustomLoggerService,
    @Inject(REQUEST) private request: Request,
  ) {}

  prepareFetchTokenData(authIp) {
    const clientId = this.configService.get('app_client_id');
    const clientSecret = this.configService.get('app_client_secret');

    if (!clientId || !clientSecret) {
      throw new HttpException(
        'Client id and client secret are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!authIp) {
      throw new HttpException(
        'Auth Service Ip is required',
        HttpStatus.BAD_REQUEST,
      );
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

  async execute(domain, gatewayRequest: GatewayRequest) {
    const ip = this.ipResolverService.resolve(domain, process.env.ENV);
    const appName = this.configService.get('app_name');
    const key = `client-access-token-${appName}`;
    let token = await this.cacheService.get(key);
    if (!token && appName !== 'auth') {
      const authIp = await this.ipResolverService.resolve(
        'auth',
        process.env.ENV,
      );
      const data = this.prepareFetchTokenData(authIp);
      const accessCode = await this.fetchAccessCodeService.execute(
        authIp,
        data,
      );
      const accessToken = await this.fetchAccessTokenService.execute(
        accessCode,
        authIp,
        data,
      );
      token = await this.cacheService.set(key, accessToken);
    }

    try {
      const {
        path,
        method,
        headers = {},
        token: userAccessToken = null,
        body = undefined,
        qs = {},
      } = gatewayRequest;

      const url = `${ip}${path}`;
      const requestHeaders: any = this.request.headers;
      const accessTokenFromRequestHeader =
        requestHeaders.access_token || undefined;
      const userId = requestHeaders.user_id || null;

      if (accessTokenFromRequestHeader && userId) {
        const token = await this.cacheService.get(`user-token-${userId}`);

        if (token !== accessTokenFromRequestHeader) {
          throw new UnauthorizedException();
        }
      }
      const query = ((this.request as any) || {}).query || null;
      const fetchedResponse = await this.fetchService.execute(url, {
        method,
        headers: {
          ...headers,
          client_name: appName,
          client_access_token: token,
          access_token: userAccessToken ?? accessTokenFromRequestHeader,
          Authorization: `Bearer ${accessTokenFromRequestHeader}`,
        },
        body: body ? body : undefined,
        qs: {
          ...qs,
          page: query.page || undefined,
          limit: query.limit || undefined,
          nextCursor: query.nextCursor || undefined,
          previousCursor: query.previousCursor || undefined,
          search: query.search || undefined,
          sortBy: query.sortBy || undefined,
        },
      });

      return fetchedResponse;
    } catch (e) {
      this.loggerService.error(
        `Service Name: ${domain}. Response :: ${e.toString()}`,
      );
      throw e;
    }
  }
}
