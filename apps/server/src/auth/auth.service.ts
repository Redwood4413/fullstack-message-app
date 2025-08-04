import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { } from '@message-app/schemas';
import { registerSchema } from '@message-app/schemas';

//TODO: delete this shit
interface User {
  name: string;
  id: string;
  email: string;
  password: string;
  lastSeen: Date;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  constructor(private userService: UserService) { }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.user({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }
  async signUp(input) {
    console.log(registerSchema);
    // const isValid = registerSchema.parse()

    const isExists = await this.userService.user({ email: input.email });
    if (isExists) {
      throw new ConflictException('Email already in use.');
    }

    return await this.userService.createUser(input);
  }
}
