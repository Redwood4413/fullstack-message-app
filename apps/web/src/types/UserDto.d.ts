import { User } from '@server/zod/index';

type UserDto = Omit<User, 'password' | 'refreshToken'>;
