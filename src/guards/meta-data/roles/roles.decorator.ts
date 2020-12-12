import { SetMetadata } from '@nestjs/common';

export const HasRoles = (roles: string[], type: string) =>
  SetMetadata('has-roles', { roles, type });
