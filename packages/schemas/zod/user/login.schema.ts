import { UserSchema as BaseSchema } from '../../prisma/generated/zod'
import * as z from 'zod'

export default z.object({
  ...BaseSchema.shape,
  email: z.email({ error: 'Incorrect email.' }),
  password: z.string().max(255, { error: 'Your password is too long.' }),
})
