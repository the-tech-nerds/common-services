import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IpResolverService} from "./ip-resolver.service";
import {CacheService} from "..";
import * as fetch from 'isomorphic-fetch';
import {FetchService} from "../fetch/fetch.service";
import {AuthorizationCode, GenericResponse, Token} from "./gateway";

@Injectable()
export class GatewayService {
  constructor(
      private readonly ipResolverService:IpResolverService,
      private readonly cacheService: CacheService,
      private readonly fetchService: FetchService,
  ) {}

  async execute(domain, {
    method = 'GET',
    headers = {},
    qs = {},
    body = '',
    userId: reqUserId = 0,
    token: optionToken = '',
  }) {
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
      const response: GenericResponse<AuthorizationCode>  = await this.fetchService.execute(url, {
        qs: {
          client_id: clientId,
          user_id: userId,
          response_type: responseType,
          redirect_uri: redirectUri,
        }
      });
      const {
        code: responseCode,
        data: {
          code = null,
        } = {},
      }  = response;

      if (responseCode !== 200 || !code) {
        throw new HttpException("Could not generate valid authorization code!", HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const body = {
        client_id: clientId,
        secret: 'lLuxT04mHwEzvqNYMkUfUXBMNad0zZoqLxms6LIouUmpbz5WC7nCNMYXKcbzoJJa',
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'localhost:8001',
      }
      const tokenResponse: GenericResponse<Token> = await this.fetchService.execute(`${authIp}authorization/oauth/token`,
          {
            method: 'POST',
            body,
          }
      );
      const {
        code: tokenResponseCode,
        data: {
          access_token: {
            value: accessToken,
          },
        } = {}
      } = tokenResponse;

      if (responseCode !== 200 || !accessToken) {
        throw new HttpException("Could not generate valid access token!", HttpStatus.INTERNAL_SERVER_ERROR);
      }

      token = await this.cacheService.set(key, accessToken);
    }
    console.log('after storing ');
    console.log(token);
    // this.fetchService.execute()/
    // c  onst clientToken = this.httpService.post(ip);
  }
}