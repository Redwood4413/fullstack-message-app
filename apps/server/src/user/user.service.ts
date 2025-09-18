import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@message-app/server';
import { Prisma } from '../../prisma';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'types';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  getUserDto(user: User): UserDto {
    const { createdAt, email, id, lastSeen, name } = user;
    return {
      createdAt,
      email,
      id,
      lastSeen,
      name,
    };
  }
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
  async validate(email: string, password: string): Promise<User> {
    const user = await this.user({ email });
    if (!user)
      throw new UnauthorizedException('E-mail not found.', {
        cause: { field: 'email' },
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Wrong password.', {
        cause: { field: 'password' },
      });

    return user;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const result = await this.prismaService.user.create({
      data,
    });
    return result;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }
}
