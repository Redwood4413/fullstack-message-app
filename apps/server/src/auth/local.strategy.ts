import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@message-app/server';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User | Error> {
    return await this.userService.validate(email, password);
  }
}
