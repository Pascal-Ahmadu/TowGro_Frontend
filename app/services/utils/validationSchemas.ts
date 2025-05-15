import { z } from 'zod';

export const LoginSchema = z.object({
    identifier: z.string().refine(val => 
        val.includes('@') ? 
        /\S+@\S+\.\S+/.test(val) : 
        /^\+[1-9]\d{1,14}$/.test(val),
        'Must be valid email or E.164 phone'
    ),
    password: z.string().min(8)
});

export const RegistrationSchema = z.object({
    email:z.string().email(),
    password: z.string().min(8),
    phoneNumber:z.string().regex(/^\+?[1-9]\d{1,14}$/)
})