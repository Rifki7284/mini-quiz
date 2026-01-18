export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};