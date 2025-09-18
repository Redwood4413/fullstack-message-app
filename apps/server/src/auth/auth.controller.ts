import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Get,
  UseFilters,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import z from 'zod';
import { type registerSchema } from 'validation/user';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { UserDto } from 'types';
import { Public } from 'src/decorators/public.decorator';
import { AuthExceptionFilter } from './auth-exception.filter';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { UserService } from 'src/user/user.service';

@UseFilters(AuthExceptionFilter)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Public()
  @Post('signup')
  async signUp(
    @Body() signUpDto: z.input<typeof registerSchema>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ua = req.header('user-agent') || '';
    const { id, email } = await this.authService.registerUser(signUpDto);
    const { hashed, token } = await this.authService.generateRefreshToken();
    const accessToken = await this.authService.generateAccessToken(id, email);
    const { deviceId } = await this.authService.storeRefreshToken(
      id,
      hashed,
      ua,
    );
    res.cookie(
      'access_token',
      accessToken,
      this.authService.accessTokenCookieOptions,
    );
    res.cookie(
      'refresh_token',
      token,
      this.authService.refreshTokenCookieOptions,
    );
    res.cookie('device_id', deviceId, this.authService.deviceCookieOptions);
  }
  // @ApiOkResponse()
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @User() user: UserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    let deviceId = req.cookies['device_id'] as string | undefined;
    const ua = req.header('user-agent') || '';
    console.log(ua);
    const { token: refreshToken, hashed } =
      await this.authService.generateRefreshToken();

    if (!deviceId) {
      const response = await this.authService.storeRefreshToken(
        user.id,
        hashed,
        ua,
      );
      deviceId = response.deviceId;
      res.cookie('device_id', deviceId, this.authService.deviceCookieOptions);
    }
    await this.authService.storeRefreshToken(user.id, hashed, ua, deviceId);
    const accessToken = await this.authService.generateAccessToken(
      user.id,
      user.email,
    );
    res.cookie(
      'access_token',
      accessToken,
      this.authService.accessTokenCookieOptions,
    );

    res.cookie(
      'refresh_token',
      refreshToken,
      this.authService.refreshTokenCookieOptions,
    );
  }
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @User() user: UserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request<{ deviceId: string; user: typeof User }>,
  ) {
    const deviceId = req.cookies['device_id'] as string | undefined;
    const refreshToken = req.cookies['refresh_token'] as string | undefined;
    if (!deviceId || !refreshToken || !req.user)
      throw new UnauthorizedException();

    const newAccessToken = await this.authService.generateAccessToken(
      user.id,
      user.email,
    );
    const newRefreshToken = await this.authService.rotateRefreshToken(
      user.id,
      deviceId,
      refreshToken,
    );

    res
      .cookie(
        'access_token',
        newAccessToken,
        this.authService.accessTokenCookieOptions,
      )
      .cookie(
        'refresh_token',
        newRefreshToken,
        this.authService.refreshTokenCookieOptions,
      );
  }

  // @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserDto) {
    return user;
  }
}
