import * as z from 'zod';

const registerSchema = z.object({
  email: z.email({ error: 'Incorrect email.' }).max(255).trim().toLowerCase(),
  name: z.string().min(2, 'Too short.').max(50, 'Too long.').trim(),
  passwordForm: z
    .object({
      password: z.string().min(3, 'Too short').max(255),
      confirm: z.string().min(3, 'Too short').max(255),
    })
    .refine((data) => data.password === data.confirm, {
      error: `Passwords don't match.`,
      path: ['confirm'],
    }),
});

export default registerSchema;
