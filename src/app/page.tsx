"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { ChatArea } from "@/components/layout/chat-area";
import { ArtifactPanel } from "@/components/layout/artifact-panel";

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <ChatArea />
      <ArtifactPanel />
    </main>
  );
}
