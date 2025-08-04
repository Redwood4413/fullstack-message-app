"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("../../prisma/generated/zod");
const z = require("zod");
exports.default = z.object({
    ...zod_1.UserSchema.shape,
    email: z.email({ error: 'Incorrect email.' }),
    password: z.string().max(255, { error: 'Your password is too long.' }),
});
//# sourceMappingURL=login.schema.js.map