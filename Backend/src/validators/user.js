import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  age: z.coerce.number().min(0).max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  photoUrl: z.string().optional(),
  age: z.number().min(0).max(120).optional(),
  gender: z.string().min(2).max(100).optional(),
  skills: z.array(z.string()).optional(),
  about: z.string().max(500).optional()
});