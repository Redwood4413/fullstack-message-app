import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true, skipProcessEnv: true }),
  ],
  providers: [{ provide: 'APP_GUARD', useClass: JwtAuthGuard }],
  controllers: [AppController],
})
export class AppModule { }
