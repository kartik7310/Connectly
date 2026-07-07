import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  age: z.coerce.number().min(0).max(120).optional(),
  otp: z.string().min(6).max(6),
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
  about: z.string().max(500).optional(),
  bio: z.string().max(500).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").optional(),
  dob: z.string().optional(),
  coverImage: z.string().optional(),
  profession: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  website: z.string().max(200).optional(),
  socialLinks: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
  }).optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
  password: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
});