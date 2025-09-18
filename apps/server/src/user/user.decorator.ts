import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'types';

export const User = createParamDecorator(
  <K extends keyof UserDto = keyof UserDto>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): UserDto[K] | UserDto | undefined => {
    const req = ctx.switchToHttp().getRequest<{ user: UserDto }>();
    const user = req.user;
    if (!user) return undefined;
    if (data) return user[data];
    return user;
  },
);
