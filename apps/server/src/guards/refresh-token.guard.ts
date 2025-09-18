import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const refreshToken = req.cookies?.['refresh_token'] as string | undefined;
    const deviceId = req.cookies?.['device_id'] as string | undefined;
    if (!refreshToken || !deviceId) return false;

    const userDto = await this.authService.validateSession(
      deviceId,
      refreshToken,
    );

    if (!userDto) return false;

    req.user = userDto;
    return true;
  }
}
