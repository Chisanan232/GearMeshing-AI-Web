// src/contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "@/services/auth/types";
import { usePlugin } from "@/contexts/plugin-context/plugin-context";
import { useUIStore } from "@/store/use-ui-store";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authService } = usePlugin();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = authService.getUser();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(currentUser);
    } catch (error) {
      console.error("Auth initialization failed", error);
      setUser(null);
    }
    setIsLoading(false);
  }, [authService]);

  const login = useCallback(() => {
    const loggedInUser = authService.login();
    setUser(loggedInUser);
  }, [authService]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);

    // Clear all user data from the UI store
    useUIStore.getState().clearAllData();
  }, [authService]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
