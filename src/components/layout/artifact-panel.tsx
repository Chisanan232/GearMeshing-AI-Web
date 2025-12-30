// src/components/layout/artifact-panel.tsx
import { useUIStore } from "@/store/use-ui-store";
import { X, FileCode, Trello } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ArtifactPanel() {
  const { activeArtifact, closeArtifact } = useUIStore();

  if (!activeArtifact) return null;

  return (
    <div className="w-[400px] border-l bg-background h-full flex flex-col shadow-xl animate-in slide-in-from-right-10 duration-200">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          {activeArtifact === "diagram" && (
            <>
              <FileCode className="h-4 w-4 text-blue-500" /> Schema Design
            </>
          )}
          {activeArtifact === "task_board" && (
            <>
              <Trello className="h-4 w-4 text-green-500" /> Task Board
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={closeArtifact}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {activeArtifact === "diagram" && (
          <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground bg-muted/20">
            [這裡會渲染 Mermaid.js 圖表]
            <br />
            ER Diagram Content...
          </div>
        )}

        {activeArtifact === "task_board" && (
          <div className="space-y-4">
            {/* Mock Task Item */}
            <div className="rounded border p-3 bg-card">
              <div className="text-sm font-medium">ClickUp-1024</div>
              <div className="text-xs text-muted-foreground">
                API Implementation
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
