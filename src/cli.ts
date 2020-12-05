import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { INestApplication } from '@nestjs/common';

export const commandRegistration = async (
  module: INestApplication,
): Promise<void> => {
  const app = await NestFactory.createApplicationContext(module, {
    logger: false, // no logger
  });
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
};
