import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IpResolverService } from './ip-resolver.service';
import { CacheService } from '..';
import { FetchService } from '../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { FetchAccessCodeService } from './fetch-access-code.service';
import { FetchAccessTokenService } from './fetch-access-token.service';

export interface GatewayRequest {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  path?: string;
  headers?: { [s: string]: string };
  qs?: { [s: string]: string | Array<string | number> };
  body?: Record<string, unknown>;
  userId?: number;
  token?: string;
}

@Injectable()
export class GatewayService {
  constructor(
    private readonly ipResolverService: IpResolverService,
    private readonly cacheService: CacheService,
    private readonly fetchService: FetchService,
    private readonly configService: ConfigService,
    private readonly fetchAccessCodeService: FetchAccessCodeService,
    private readonly fetchAccessTokenService: FetchAccessTokenService,
  ) {}

  prepareFetchTokenData() {
    const clientId = this.configService.get('app_client_id');
    const clientSecret = this.configService.get('app_client_secret');

    if (!clientId || !clientSecret) {
      throw new HttpException(
        'Client id and client secret are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = '1';
    const responseType = 'code';
    const redirectUri =
      'http://localhost:8081/api/v1/authorization/oauth/token';
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
    const ip = this.ipResolverService.resolve(domain);
    const appName = this.configService.get('app_name');
    const key = `client-access-token-${appName}`;
    let token = await this.cacheService.get(key);
    if (!token) {
      const authIp = await this.ipResolverService.resolve('auth');
      const data = this.prepareFetchTokenData();
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

    const { path, method, headers, token: userAccessToken } = gatewayRequest;

    const url = `${ip}${path}`;
    return this.fetchService.execute(url, {
      method,
      headers: {
        ...headers,
        client_name: appName,
        client_access_token: token,
        user_access_token: userAccessToken,
      },
    });
  }
}
