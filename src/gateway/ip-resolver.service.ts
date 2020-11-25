import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import gatewayServices from './gateway.services';

@Injectable()
export class IpResolverService {
  private readonly services = gatewayServices;

  resolve(serviceName, environment = 'local') {
    if (!this.services[serviceName]) {
      throw new HttpException(
        `Service ${serviceName} is not supported`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!this.services[serviceName][environment]) {
      throw new HttpException(
        `No information for ${environment} env of ${serviceName}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.services[serviceName][environment];
  }
}
