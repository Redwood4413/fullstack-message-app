import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { JwtStrategy } from './jwt.strategy';
// import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthService } from './jwt-auth.service';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
@Module({
  imports: [
    UserModule,
    PassportModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    RefreshTokenGuard,
    JwtAuthGuard,
    JwtAuthService,
  ],
})
export class AuthModule { }
