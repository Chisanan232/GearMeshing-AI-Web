// src/components/layout/app-sidebar.tsx
"use client";

import Image from "next/image";
import { UserProfileMenu } from "./user-profile-menu";
import { SidebarSessions } from "./sidebar-sessions";

export function AppSidebar() {
  return (
    <div className="relative flex h-full w-[300px] flex-col border-r hidden md:flex overflow-visible z-50">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-white/10 bg-neutral-950 px-4 font-semibold flex-shrink-0">
        <Image
          src="/gearmeshing-ai-logo.png"
          alt="GearMeshing AI"
          width={24}
          height={24}
          className="mr-2"
        />
        GearMeshing AI
      </div>

      {/* Sessions & Folders - Allow overflow for dropdowns */}
      <div className="flex-1 overflow-visible min-h-0">
        <SidebarSessions />
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-neutral-950 p-2 flex-shrink-0">
        <UserProfileMenu />
      </div>
    </div>
  );
}
