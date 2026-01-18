import { z } from "zod";
import { userProfileSchema } from "./user.schema";

export const userResponseSchema = z.object({
  success: z.literal(true),
  data: userProfileSchema,
});

export type UserProfileResponse = z.infer<
  typeof userResponseSchema
>;
