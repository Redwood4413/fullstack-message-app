import * as z from 'zod';
declare const registerSchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodString;
    passwordForm: z.ZodObject<{
        password: z.ZodString;
        confirm: z.ZodString;
    }, z.z.core.$strip>;
    id: z.ZodString;
    password: z.ZodString;
    lastSeen: z.z.ZodCoercedDate<unknown>;
    createdAt: z.z.ZodCoercedDate<unknown>;
}, z.z.core.$strip>;
export default registerSchema;
