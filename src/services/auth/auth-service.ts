// src/services/auth/auth-service.ts
"use client";

import { IAuthService, User, UserSchema } from "./types";

const MOCK_USER: User = {
  id: "bryant-chan",
  name: "Bryant Chan",
  email: "bryant.chan@example.com",
};

/**
 * Mock Authentication Service
 * This service simulates user authentication using localStorage.
 */
export class AuthService implements IAuthService {
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

  updateUser(updates: Partial<User>): User {
    if (typeof window === "undefined") {
      throw new Error("Cannot update user on server side");
    }

    const currentUser = this.getUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const updatedUser = { ...currentUser, ...updates };
    
    // Validate with schema
    const parsedUser = UserSchema.parse(updatedUser);
    
    window.localStorage.setItem(this.storageKey, JSON.stringify(parsedUser));
    return parsedUser;
  }
}

export const authService = new AuthService();
