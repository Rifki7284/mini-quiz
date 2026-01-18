import { z } from "zod";

export const userRoleSchema = z.enum(["user"]);

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.string(),
  is_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
