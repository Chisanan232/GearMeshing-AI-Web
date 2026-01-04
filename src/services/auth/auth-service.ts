// src/services/auth/auth-service.ts
"use client";

import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

const MOCK_USER: User = {
  id: "bryant-chan",
  name: "Bryant Chan",
  email: "bryant.chan@example.com",
};

/**
 * Mock Authentication Service
 * This service simulates user authentication using localStorage.
 */
export class AuthService {
  private storageKey = "gearmeshing-auth-user";

  getUser(): User | null {
    if (typeof window === "undefined") return null;

    try {
      const storedUser = window.localStorage.getItem(this.storageKey);
      if (storedUser) {
        return UserSchema.parse(JSON.parse(storedUser));
      }
      return null;
    } catch (error) {
      console.error("Failed to get user from localStorage", error);
      this.logout(); // Clear corrupted data
      return null;
    }
  }

  login(): User {
    if (typeof window === "undefined") return MOCK_USER;

    const user = MOCK_USER;
    window.localStorage.setItem(this.storageKey, JSON.stringify(user));
    return user;
  }

  logout(): void {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(this.storageKey);
  }
}

export const authService = new AuthService();
