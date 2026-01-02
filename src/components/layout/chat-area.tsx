// src/components/layout/chat-area.tsx
import { useUIStore } from "@/store/use-ui-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send, Cpu, Bot, GitCompare, FileText } from "lucide-react";
import { CommandApproval } from "@/components/ui/command-approval";
import { ChatMessage } from "@/components/chat/chat-message";
import { useArtifactInRunningAgent } from "@/hooks/useArtifactInRunningAgent";
import { useApprovalWithPolicies } from "@/hooks/useApprovalWithPolicies";

export function ChatArea() {
  const { openArtifact } = useUIStore();
  const { mermaidCode, originalCode, modifiedCode, spec } =
    useArtifactInRunningAgent();
  const {
    sampleApproval,
    sampleMCPApproval,
    sampleCommandApproval,
    sampleNpmApproval,
    sampleApiApproval,
    sampleSearchApproval,
    sampleFileApproval,
  } = useApprovalWithPolicies();

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="flex h-14 items-center border-b px-6 flex-shrink-0 min-w-0">
        <span className="font-medium truncate">
          Agent Team: Architecture Squad
        </span>
      </div>

      {/* Messages - Scrollable */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* User Message */}
          <div className="flex justify-end gap-3">
            <div className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
              我們需要重新設計 user table 的 schema。
            </div>
            <Avatar>
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>

          {/* AI Message with Action */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarImage src="/bot.png" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex max-w-[80%] flex-col gap-2">
              <div className="font-semibold text-sm">Architect Agent</div>
              <div className="rounded-lg border bg-muted/50 px-4 py-2 text-sm">
                沒問題。我已經根據當前的業務需求草擬了一份新的 Schema 設計。
                <br />
                請查看右側的 ER Diagram。
              </div>

              {/* Tool / Artifact Trigger Card */}
              <Card
                className="flex items-center justify-between p-3 w-fit gap-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => openArtifact("diagram", { type: "mermaid" })}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  Generated Artifact
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">
                  View Schema
                </Button>
              </Card>
              {/* Tool / Artifact Trigger Card */}
              <Card
                className="flex items-center justify-between p-3 w-fit gap-4 cursor-pointer hover:bg-muted/80 transition-colors border-l-4 border-l-blue-500"
                // 點擊時傳入 content
                onClick={() =>
                  openArtifact("diagram", {
                    type: "mermaid",
                    content: mermaidCode,
                  })
                }
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  Generated Artifact
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">
                  View Schema
                </Button>
              </Card>
            </div>
          </div>

          {/* Developer Agent Message - Sequential after Architect */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>Dev</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[80%] flex-col gap-2">
              <div className="font-semibold text-sm">Developer Agent</div>
              <div className="rounded-lg border bg-muted/50 px-4 py-2 text-sm">
                我已經為 `getUser` 函數添加了 Redis 快取層，並優化了錯誤日誌。
                <br />
                請檢視代碼差異。
              </div>

              {/* Code Review Card */}
              <Card
                className="group flex items-center justify-between p-3 w-[280px] gap-4 cursor-pointer hover:border-purple-500 transition-all"
                onClick={() =>
                  openArtifact("code_diff", {
                    original: originalCode,
                    modified: modifiedCode,
                    language: "typescript",
                    filePath: "src/services/user-service.ts",
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <GitCompare className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Review Changes</span>
                    <span className="text-xs text-muted-foreground">
                      user-service.ts
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  Open
                </Button>
              </Card>
            </div>
          </div>

          {/* Product Manager Agent Message - Sequential after Developer */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[80%] flex-col gap-2">
              <div className="font-semibold text-sm">Product Manager Agent</div>
              <div className="rounded-lg border bg-muted/50 px-4 py-2 text-sm">
                根據剛剛的討論，我整理了一份身份驗證重構的技術規格書。
                <br />
                其中包含了資料庫變更與實作步驟，請確認。
              </div>

              {/* Spec Document Card */}
              <Card
                className="group flex items-center justify-between p-3 w-[280px] gap-4 cursor-pointer hover:border-orange-500 transition-all"
                onClick={() =>
                  openArtifact("markdown", {
                    title: "Auth Refactor Spec v1.0",
                    content: spec,
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Tech Spec</span>
                    <span className="text-xs text-muted-foreground">
                      Markdown Doc
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  Read
                </Button>
              </Card>
            </div>
          </div>

          {/* Developer Agent Message - With Inline MCP Approval */}
          <ChatMessage
            role="assistant"
            content="I need to analyze your project structure on Google Drive. Let me list the files to understand the current architecture."
            avatarFallback="Dev"
            inlineApprovals={[sampleMCPApproval]}
            isMini={false}
          />

          {/* Developer Agent Message - With Inline Command Approval */}
          <ChatMessage
            role="assistant"
            content="Now I'll execute the database migration to add OAuth2 provider columns. This requires your approval."
            avatarFallback="Dev"
            inlineApprovals={[sampleCommandApproval]}
            isMini={false}
          />

          {/* System Message - Approval Request (High Risk) */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>⚠️</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[95%] flex-col gap-2 w-full">
              <div className="font-semibold text-sm text-red-600">
                Approval Required - High Risk
              </div>
              <div className="rounded-lg border bg-red-500/5 px-4 py-2 text-sm">
                The Developer Agent is requesting approval to execute a critical
                database migration. This operation requires human review due to
                its high-risk nature.
              </div>

              {/* Command Approval Component */}
              <div className="w-full">
                <CommandApproval
                  approval={sampleApproval}
                  runId={sampleApproval.run_id}
                  onApprovalResolved={(approval) => {
                    console.log("Approval resolved:", approval);
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Message - NPM Install Approval (Low Risk) */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>ℹ️</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[95%] flex-col gap-2 w-full">
              <div className="font-semibold text-sm text-blue-600">
                Approval Required - Low Risk
              </div>
              <div className="rounded-lg border bg-blue-500/5 px-4 py-2 text-sm">
                Installing authentication dependencies. You can edit the command
                if needed.
              </div>

              {/* Command Approval Component */}
              <div className="w-full">
                <CommandApproval
                  approval={sampleNpmApproval}
                  runId={sampleNpmApproval.run_id}
                  onApprovalResolved={(approval) => {
                    console.log("NPM approval resolved:", approval);
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Message - Deployment Approval (Medium Risk) */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>⚡</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[95%] flex-col gap-2 w-full">
              <div className="font-semibold text-sm text-yellow-600">
                Approval Required - Medium Risk
              </div>
              <div className="rounded-lg border bg-yellow-500/5 px-4 py-2 text-sm">
                Deploying authentication service to production. Please review
                and approve the deployment command.
              </div>

              {/* Command Approval Component */}
              <div className="w-full">
                <CommandApproval
                  approval={sampleApiApproval}
                  runId={sampleApiApproval.run_id}
                  onApprovalResolved={(approval) => {
                    console.log("Deployment approval resolved:", approval);
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Message - Web Search Approval (MCP Tool) */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>🔍</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[95%] flex-col gap-2 w-full">
              <div className="font-semibold text-sm text-green-600">
                Approval Required - Web Search
              </div>
              <div className="rounded-lg border bg-green-500/5 px-4 py-2 text-sm">
                Agent wants to search for OAuth2 best practices. You can modify
                the search query if needed.
              </div>

              {/* Command Approval Component */}
              <div className="w-full">
                <CommandApproval
                  approval={sampleSearchApproval}
                  runId={sampleSearchApproval.run_id}
                  onApprovalResolved={(approval) => {
                    console.log("Search approval resolved:", approval);
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Message - File Operation Approval (MCP Tool) */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border bg-muted">
              <AvatarFallback>📄</AvatarFallback>
            </Avatar>
            <div className="flex max-w-[95%] flex-col gap-2 w-full">
              <div className="font-semibold text-sm text-purple-600">
                Approval Required - File Operation
              </div>
              <div className="rounded-lg border bg-purple-500/5 px-4 py-2 text-sm">
                Agent needs to read authentication configuration files. You can
                modify the file path if needed.
              </div>

              {/* Command Approval Component */}
              <div className="w-full">
                <CommandApproval
                  approval={sampleFileApproval}
                  runId={sampleFileApproval.run_id}
                  onApprovalResolved={(approval) => {
                    console.log("File operation approval resolved:", approval);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t p-4">
        <div className="relative">
          <Input placeholder="Message to GearMeshing AI..." className="pr-12" />
          <Button
            size="icon"
            className="absolute right-1 top-1 h-8 w-8"
            variant="ghost"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
