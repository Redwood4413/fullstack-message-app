import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'types';

export type JwtPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.['access_token'] as string;
          if (!token) throw new UnauthorizedException();
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }
  async validate(payload: JwtPayload): Promise<UserDto> {
    const user = await this.userService.user({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    return (({ createdAt, email, id, lastSeen, name }) => ({
      createdAt,
      email,
      id,
      lastSeen,
      name,
    }))(user);
  }
}
