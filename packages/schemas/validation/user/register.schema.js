"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("../../prisma/generated/zod");
const z = require("zod");
const registerSchema = z.object({
    ...zod_1.UserSchema.shape,
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
});
exports.default = registerSchema;
//# sourceMappingURL=register.schema.js.map