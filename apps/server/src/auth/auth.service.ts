import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../user/user.service';
import * as b from 'bcrypt';
import { registerSchema } from 'validation/user';
import { User } from 'prisma';
import z from 'zod';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthService } from './jwt-auth.service';
import { randomBytes } from 'crypto';
import { CookieOptions } from 'express';
import { UserSession } from 'src/main';

@Injectable()
export class AuthService {
  refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: Number(process.env.REFRESH_TOKEN_TTL || 1440) * 60000,
    secure: process.env.PROD === 'true',
    sameSite: 'strict',
    path: '/',
  };
  deviceCookieOptions: CookieOptions = {
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    secure: process.env.PROD === 'true',
    sameSite: 'strict',
  };
  accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: Number(process.env.JWT_TTL) * 1000 * 60,
    secure: process.env.PROD === 'true',
    sameSite: 'strict',
    path: '/',
  };
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private readonly jwtAuthService: JwtAuthService,
  ) { }

  async registerUser(input: z.input<typeof registerSchema>): Promise<User> {
    const data = registerSchema.parse(input);

    const user = await this.userService.user({ email: data.email });
    if (user)
      throw new UnauthorizedException('E-mail already in use.', {
        cause: { field: 'email' },
      });

    const salt = await b.genSalt();
    const { email, name, passwordForm } = data;

    return await this.userService.createUser({
      email,
      name,
      password: await b.hash(passwordForm.password, salt),
    });
  }

  async generateAccessToken(userId: string, email: string) {
    return this.jwtAuthService.signJWT({
      id: userId,
      email,
    });
  }
  async generateRefreshToken() {
    const token = randomBytes(32).toString('hex');
    const salt = await b.genSalt();
    const hashed = await b.hash(token, salt);

    return { token, hashed };
  }
  async storeRefreshToken(
    userId: string,
    hashedToken: string,
    userAgent: string,
    deviceId?: string,
  ): Promise<UserSession> {
    const ttl = Number(process.env.REFRESH_TOKEN_TTL || 1440) * 60000;

    const finalDeviceId = deviceId || randomBytes(16).toString('hex');

    return await this.prismaService.userSession.upsert({
      where: {
        userId_deviceId: {
          userId,
          deviceId: finalDeviceId,
        },
      },
      create: {
        userId,
        userAgent,
        deviceId: finalDeviceId,
        hashedToken,
        expiresAt: new Date(Date.now() + ttl),
      },
      update: {
        hashedToken,
        expiresAt: new Date(Date.now() + ttl),
      },
    });
  }
  async updateRefreshToken(
    userId: string,
    hashedToken: string,
    deviceId: string,
  ): Promise<UserSession> {
    const ttl = Number(process.env.REFRESH_TOKEN_TTL || 1440) * 60000;
    return await this.prismaService.userSession.update({
      data: {
        hashedToken,
        expiresAt: new Date(Date.now() + ttl),
      },
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });
  }
  async rotateRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ) {
    await this.validateSession(deviceId, refreshToken);
    const { token, hashed } = await this.generateRefreshToken();
    await this.updateRefreshToken(userId, hashed, deviceId);

    return token;
  }
  async validateSession(deviceId: string, refreshToken: string) {
    const session = await this.prismaService.userSession.findFirst({
      where: {
        deviceId,
      },
      include: { user: true },
    });
    if (!session) throw new UnauthorizedException();
    const { hashedToken, revoked, expiresAt, user } = session;

    const isValid = await b.compare(refreshToken, hashedToken);
    // console.log(`-----------------`);
    // console.log(`RT: ${refreshToken}`);
    // console.log(`Hash: ${hashedToken}`);
    // console.log(`Valid: ${isValid}`);
    // console.log(`DeviceID: ${deviceId}`);

    if (!isValid || revoked)
      throw new UnauthorizedException('Your session is invalid.');

    if (expiresAt < new Date()) {
      await this.prismaService.userSession.delete({
        where: {
          userId_deviceId: {
            deviceId,
            userId: user.id,
          },
        },
      });
      throw new UnauthorizedException('Your session has expired.');
    }
    const userDto = this.userService.getUserDto(user);
    return userDto;
  }
}
