import { SetMetadata } from '@nestjs/common';

export const HasPermissions = (permissions: string[], type = 1) =>
  SetMetadata('has-permissions', {
    permissions,
    type,
  });
