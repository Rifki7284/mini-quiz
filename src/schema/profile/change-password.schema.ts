import { z } from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/;

const PASSWORD_MESSAGE =
  "Password must be at least 8 characters with uppercase, lowercase, number, and special character";


export const changePasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(1, "Current password is required"),

    new_password: z
      .string()
      .min(8, PASSWORD_MESSAGE)
      .regex(PASSWORD_REGEX, PASSWORD_MESSAGE),

    confirm_password: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: "Passwords don't match",
      });
    }

    if (data.old_password === data.new_password) {
      ctx.addIssue({
        code: "custom",
        path: ["new_password"],
        message: "New password must be different from current password",
      });
    }
  });


export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
