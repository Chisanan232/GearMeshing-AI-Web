// src/components/layout/artifact-panel.tsx
import { useUIStore } from "@/store/use-ui-store";
import { X, FileCode, Trello } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MermaidChart } from "@/components/ui/mermaid-chart"; // Import 新組件

export function ArtifactPanel() {
  const { activeArtifact, artifactData, closeArtifact } = useUIStore();

  if (!activeArtifact) return null;

  return (
    <div className="w-[450px] border-l bg-background h-full flex flex-col shadow-xl animate-in slide-in-from-right-10 duration-200">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4 bg-muted/10">
        <div className="flex items-center gap-2 font-semibold">
          {activeArtifact === "diagram" && (
            <>
              <FileCode className="h-4 w-4 text-blue-500" /> Architecture
              Diagram
            </>
          )}
          {activeArtifact === "task_board" && (
            <>
              <Trello className="h-4 w-4 text-green-500" /> Task Board
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeArtifact}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-neutral-900/50">
        {/* Scenario 1: Mermaid Diagram */}
        {activeArtifact === "diagram" &&
          artifactData &&
          "content" in artifactData && (
            <div className="p-4">
              <div className="mb-4 text-sm text-muted-foreground">
                以下是根據需求生成的資料庫關聯圖 (ER Diagram)：
              </div>
              <div className="rounded-lg border bg-card p-2 shadow-sm">
                <MermaidChart code={String(artifactData.content)} />
              </div>
            </div>
          )}

        {/* Scenario 2: Task Board (Placeholder) */}
        {activeArtifact === "task_board" && (
          <div className="p-6 space-y-4">
            <div className="rounded border p-3 bg-card hover:bg-accent cursor-pointer transition">
              <div className="flex justify-between items-start">
                <div className="text-sm font-medium">ClickUp-1024</div>
                <div className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                  In Progress
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                API Implementation
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
