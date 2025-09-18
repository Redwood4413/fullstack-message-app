import { User } from 'prisma/generated/zod';

export type UserDto = Omit<User, 'password' | 'refreshToken'>;
