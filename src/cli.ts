import { CommandModule, CommandService } from 'nestjs-command';
import { INestApplication } from '@nestjs/common';

export const commandRegistration = async (
  app: INestApplication,
): Promise<void> => {
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
};
