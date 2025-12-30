// src/components/layout/artifact-panel.tsx
import { useUIStore } from "@/store/use-ui-store";
import { X, FileCode, Trello } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MermaidChart } from "@/components/ui/mermaid-chart"; // Import 新組件
import { CodeDiffViewer } from "@/components/ui/code-diff-viewer"; // Import 新組件
import { GitCompare } from "lucide-react"; // Import Icon
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"; // Import 新組件
import { FileText } from "lucide-react";

export function ArtifactPanel() {
  const { activeArtifact, artifactData, closeArtifact } = useUIStore();

  if (!activeArtifact) return null;

  // 根據內容類型動態調整 Panel 寬度
  // Diff View 和 Markdown 需要寬一點 (500px)，普通的圖表 380px 即可
  const panelWidth =
    activeArtifact === "code_diff" || activeArtifact === "markdown"
      ? "w-[500px]"
      : "w-[380px]";

  return (
    <div
      className={`${panelWidth} border-l bg-background h-full flex flex-col shadow-xl transition-all duration-300 ease-in-out`}
    >
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

          {/* 新增 Diff View Header */}
          {activeArtifact === "code_diff" &&
            artifactData &&
            "filePath" in artifactData && (
              <>
                <GitCompare className="h-4 w-4 text-purple-500" />
                <span className="truncate max-w-[300px]">
                  {String(artifactData.filePath) || "Changes Review"}
                </span>
              </>
            )}

          {/* 新增 Markdown Header */}
          {activeArtifact === "markdown" &&
            artifactData &&
            "title" in artifactData && (
              <>
                <FileText className="h-4 w-4 text-orange-500" />
                <span className="truncate max-w-[300px]">
                  {String(artifactData.title) || "Documentation"}
                </span>
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
      {/* 注意：這裡要設為 flex-1 且 h-full，否則 Monaco Editor 會撐不開 */}
      <div className="flex-1 overflow-hidden bg-neutral-900/50 flex flex-col">
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

        {/* Scenario 3: Code Diff View */}
        {activeArtifact === "code_diff" &&
          artifactData &&
          "original" in artifactData &&
          "modified" in artifactData && (
            <div className="h-full w-full p-0">
              {/* Monaco Editor 需要父容器有明確的高度 */}
              <CodeDiffViewer
                original={String(artifactData.original)}
                modified={String(artifactData.modified)}
                language={
                  ("language" in artifactData
                    ? String(artifactData.language)
                    : "typescript") || "typescript"
                }
              />
            </div>
          )}

        {/* Scenario 4: Markdown Document */}
        {activeArtifact === "markdown" &&
          artifactData &&
          "content" in artifactData && (
            <div className="p-8 max-w-4xl mx-auto">
              <MarkdownRenderer content={String(artifactData.content)} />
            </div>
          )}
      </div>
    </div>
  );
}
