import { PrismaClient } from '@prisma/client/scripts/default-index.js'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export default prisma
