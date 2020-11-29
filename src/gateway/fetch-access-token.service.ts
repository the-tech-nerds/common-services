import { GenericResponse, Token } from './gateway';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FetchService } from '../fetch/fetch.service';

@Injectable()
export class FetchAccessTokenService {
  constructor(private readonly fetchService: FetchService) {}

  async execute(accessCode = null, authIp = null, data = null) {
    if (!accessCode || !authIp || !data) {
      throw new HttpException(
        'Invalid data provided to fetch access token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const body = {
      client_id: data.client_id,
      secret: data.client_secret,
      code: accessCode,
      grant_type: data.grant_type,
      redirect_uri: data.redirect_uri,
    };
    const tokenResponse: GenericResponse<Token> = await this.fetchService.execute(
      `${authIp}/api/v1/authorization/oauth/token`,
      {
        method: 'POST',
        body,
      },
    );

    const {
      code: tokenResponseCode,
      data: { access_token: { value: accessToken } } = {},
    } = tokenResponse;

    if (tokenResponseCode !== 200 || !accessToken) {
      throw new HttpException(
        'Could not generate valid access token!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return accessToken;
  }
}
