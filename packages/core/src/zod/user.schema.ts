// user.schema.ts
import { z } from "zod";


export const userSelectSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  role: z.string().nullable(),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.string().nullable(),
  gradeId: z.string().nullable(),
  trialEndDate: z.string().optional(),
  isSubscribed: z.boolean().optional(),
});

export const updateUserGradeSchema = z.object({
  gradeId: z.string().min(1, "Grade is required"),
});

export const insertUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "user", "moderator"]).default("user"),
  emailVerified: z.boolean().default(false),
  banned: z.boolean().default(false),
  banReason: z.string().optional(),
  banExpires: z.string().optional(),
  gradeId: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Extended type that includes password for creation
export const createUserSchema = insertUserSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export type CreateUser = z.infer<typeof createUserSchema>;

// Types
export type User = z.infer<typeof userSelectSchema>;


