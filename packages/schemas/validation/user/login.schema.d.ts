import * as z from 'zod';
declare const _default: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    id: z.ZodString;
    name: z.ZodString;
    lastSeen: z.z.ZodCoercedDate<unknown>;
    createdAt: z.z.ZodCoercedDate<unknown>;
}, z.z.core.$strip>;
export default _default;
