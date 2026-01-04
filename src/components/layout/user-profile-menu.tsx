// src/components/layout/user-profile-menu.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  User as UserIcon,
  Settings,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileMenu() {
  const { user, login, logout, isLoading } = useAuth();

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="h-14 w-full animate-pulse rounded-lg bg-white/5"></div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3">
          {user ? (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://github.com/${user.id}.png`} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {user.name}
                </p>
                <p className="text-xs text-white/60">Settings</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-sm font-medium text-white">Login</p>
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className="w-64 mb-2 ml-2"
        asChild
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {user ? (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/account" className="flex w-full items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>User Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/features/agents" className="flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>AI Agent Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/usage" className="flex w-full items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Usage Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={login} className="cursor-pointer">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Login</span>
            </DropdownMenuItem>
          )}
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
