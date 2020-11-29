import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthorizationCode, GenericResponse } from './gateway';
import { FetchService } from '../fetch/fetch.service';

@Injectable()
export class FetchAccessCodeService {
  constructor(private readonly fetchService: FetchService) {}

  async execute(authIp, data) {
    const url = `${authIp}/api/v1/authorization/oauth/authorize`;
    const response: GenericResponse<AuthorizationCode> = await this.fetchService.execute(
      url,
      {
        qs: {
          client_id: data.client_id,
          user_id: data.user_id,
          response_type: data.response_type,
          redirect_uri: data.redirect_uri,
        },
      },
    );

    const { code: responseCode, data: { code = null } = {} } = response;

    if (responseCode !== 200 || !code) {
      throw new HttpException(
        'Could not generate valid authorization code!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return code;
  }
}
