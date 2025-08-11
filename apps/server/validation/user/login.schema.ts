import { UserSchema } from '../../prisma/generated/zod';
import * as z from 'zod';

export default z.object({
  ...UserSchema.shape,

  email: z.email({ error: 'Incorrect email.' }),
  password: z.string().max(255, { error: 'Your password is too long.' }),
});
