import * as z from 'zod';

export default z.object({
  email: z.email({ error: 'Incorrect email.' }).toLowerCase(),
  password: z.string().max(255, { error: 'Your password is too long.' }),
  isRememberMe: z.boolean().default(false),
});
