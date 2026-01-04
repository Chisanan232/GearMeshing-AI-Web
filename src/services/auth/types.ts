
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

export interface IAuthService {
  getUser(): User | null;
  login(): User;
  logout(): void;
  updateUser(user: Partial<User>): User;
}
