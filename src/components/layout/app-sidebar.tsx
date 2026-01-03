// src/components/layout/app-sidebar.tsx
import { GitBranch, History, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  return (
    <div className="flex h-full w-[260px] flex-col border-r bg-muted/30 hidden md:flex">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        <Image
          src="/gearmeshing-ai-logo.png"
          alt="GearMeshing AI"
          width={24}
          height={24}
          className="mr-2"
        />
        GearMeshing AI
      </div>

      {/* Navigation / History */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            Current Session
          </h3>
          <Button variant="secondary" className="w-full justify-start">
            <GitBranch className="mr-2 h-4 w-4" />
            Refactor Auth Flow
          </Button>
        </div>

        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            History
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
          >
            <History className="mr-2 h-4 w-4" />
            Fix ClickUp #402
          </Button>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
