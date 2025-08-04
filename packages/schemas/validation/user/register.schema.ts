import { UserSchema as BaseSchema } from '../../prisma/generated/zod'
import * as z from 'zod'

const registerSchema = z.object({
  ...BaseSchema.shape,
  email: z.email({ error: 'Incorrect email.' }).max(255),
  name: z.string().min(2, 'Too short.').max(50, 'Too long.'),
  passwordForm: z
    .object({
      password: z.string().min(3, 'Too short').max(255),
      confirm: z.string().min(3, 'Too short').max(255),
    })
    .refine((data) => data.password === data.confirm, {
      error: `Passwords don't match.`,
      path: ['confirm'],
    }),
})

export default registerSchema
