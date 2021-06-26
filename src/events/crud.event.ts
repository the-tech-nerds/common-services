import { Injectable } from '@nestjs/common';
import {
  ClientProviderOptions,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { EventTypes } from './event-types.enum';
import { serviceOptions } from './events.module';
import { Microservices } from './microservices.enum';

@Injectable()
class CRUDEvent {
  private readonly client: ClientProxy;
  constructor(serviceName: string) {
    const options: ClientProviderOptions | undefined = serviceOptions.find(
      ({ name }) => name === serviceName,
    );
    if (!options) {
      throw new Error(
        `Failed to get configuration for service: ${serviceName}`,
      );
    }

    this.client = ClientProxyFactory.create(options);
  }

  emit(
    module: string,
    microservice: Microservices,
    eventType: EventTypes,
    data: string,
  ) {
    this.client.emit(
      `${module}_${eventType}`,
      JSON.stringify({
        source: {
          microservice,
          domain: module,
          action: eventType,
        },
        data,
      }),
    );
  }
}
export { CRUDEvent };
