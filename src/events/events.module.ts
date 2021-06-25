import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { Microservices } from './microservices.enum';

export const serviceOptions: ClientsModuleOptions = [
  {
    name: Microservices.PRODUCT_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      ],
      queue: `${Microservices.PRODUCT_SERVICE}_queue`,
      queueOptions: {
        durable: true,
      },
    },
  },
  {
    name: Microservices.ORDER_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      ],
      queue: `${Microservices.ORDER_SERVICE}_queue`,
      queueOptions: {
        durable: true,
      },
    },
  },
];

@Module({
  imports: [ClientsModule.register(serviceOptions)],
})
export class EventsModule {}
