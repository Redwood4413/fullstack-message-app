import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { registerSchema } from '../../validation';
import { User } from 'prisma';
import z from 'zod';
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
  async signUp(input: z.input<typeof registerSchema>) {
    try {
      const data = registerSchema.parse(input);
      if (!data) throw new BadRequestException();
      const user = await this.userService.user({ email: data.email });
      if (user) throw new ConflictException('Email already in use.');
      const salt = await bcrypt.genSalt();
      const { email, name, passwordForm } = data;
      await this.userService.createUser({
        email,
        name,
        password: await bcrypt.hash(passwordForm.password, salt),
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
