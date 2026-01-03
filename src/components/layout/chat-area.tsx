// src/components/layout/chat-area.tsx
"use client";

import { useUIStore } from "@/store/use-ui-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send, Cpu, GitCompare, FileText } from "lucide-react";
import { CommandApproval } from "@/components/ui/command-approval";
import { ChatMessage } from "@/components/chat/chat-message";
import { GitHubPRAlert } from "@/components/chat/github-pr-alert";
import { useRunAgentEventStream } from "@/hooks/useRunAgentEventStream";

export function ChatArea() {
  const { openArtifact } = useUIStore();
  const { events } = useRunAgentEventStream();

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
          {/* Dynamically render events from agent stream */}
          {events.map((event, index) => {
            // Render chat messages
            if (event.type === "message" && event.message) {
              const msg = event.message;

              // Check if next event is an approval for this message
              const nextEvent = events[index + 1];
              const hasInlineApproval =
                nextEvent?.type === "approval" && nextEvent?.approval;

              if (msg.role === "user") {
                return (
                  <div key={event.id} className="flex justify-end gap-3">
                    <div className="rounded-lg bg-primary px-4 py-2 text-primary-foreground max-w-[70%]">
                      {msg.content}
                    </div>
                    <Avatar>
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  </div>
                );
              } else {
                // Assistant message - use ChatMessage if has inline approval
                if (hasInlineApproval) {
                  return (
                    <ChatMessage
                      key={event.id}
                      role="assistant"
                      content={msg.content}
                      avatarFallback={msg.agentName?.split(" ")[0] || "AI"}
                      inlineApprovals={[nextEvent.approval!]}
                      isMini={false}
                    />
                  );
                }

                // Regular assistant message
                return (
                  <div key={event.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 border bg-muted">
                      <AvatarImage src="/bot.png" />
                      <AvatarFallback>
                        {msg.agentName?.split(" ")[0] || "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex max-w-[70%] flex-col gap-2">
                      {msg.agentName && (
                        <div className="font-semibold text-sm">
                          {msg.agentName}
                        </div>
                      )}
                      <div className="rounded-lg border bg-muted/50 px-4 py-2 text-sm whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              }
            }

            // Render artifacts
            if (event.type === "artifact" && event.artifact) {
              const artifact = event.artifact;
              const metadata = artifact.metadata || {};

              if (artifact.type === "diagram") {
                return (
                  <div key={event.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 border bg-muted">
                      <AvatarFallback>
                        <Cpu className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex max-w-[70%] flex-col gap-2">
                      <Card
                        className="flex items-center justify-between p-3 w-fit gap-4 cursor-pointer hover:bg-muted/80 transition-colors border-l-4 border-l-blue-500"
                        onClick={() =>
                          openArtifact("diagram", {
                            type: "mermaid",
                            content: artifact.content,
                            title: artifact.title,
                          })
                        }
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Cpu className="h-4 w-4" />
                          Generated Artifact
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 text-xs"
                        >
                          View Schema
                        </Button>
                      </Card>
                    </div>
                  </div>
                );
              }

              if (artifact.type === "code_diff") {
                return (
                  <div key={event.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 border bg-muted">
                      <AvatarFallback>
                        <GitCompare className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex max-w-[70%] flex-col gap-2">
                      <Card
                        className="group flex items-center justify-between p-3 w-[280px] gap-4 cursor-pointer hover:border-purple-500 transition-all"
                        onClick={() =>
                          openArtifact("code_diff", {
                            original: metadata.original || "",
                            modified: metadata.modified || "",
                            language: metadata.language || "typescript",
                            filePath: metadata.filePath,
                          })
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <GitCompare className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              Review Changes
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {metadata.filePath || "code-diff"}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                        >
                          Open
                        </Button>
                      </Card>
                    </div>
                  </div>
                );
              }

              if (artifact.type === "github_pr") {
                const metadata = artifact.metadata || {};
                const prNumber = (metadata.pr_number as number) || 0;
                const repoName = (metadata.repo_name as string) || "Repository";
                const prTitle = (metadata.pr_title as string) || artifact.title || "";
                const description = (metadata.description as string) || artifact.content || "";
                const githubUrl = (metadata.github_url as string) || "";

                return (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <GitHubPRAlert
                        id={artifact.id}
                        prNumber={prNumber}
                        repoName={repoName}
                        prTitle={prTitle}
                        description={description}
                        githubUrl={githubUrl}
                      />
                    </div>
                  </div>
                );
              }

              if (artifact.type === "markdown") {
                return (
                  <div key={event.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 border bg-muted">
                      <AvatarFallback>
                        <FileText className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex max-w-[70%] flex-col gap-2">
                      <Card
                        className="group flex items-center justify-between p-3 w-[280px] gap-4 cursor-pointer hover:border-orange-500 transition-all"
                        onClick={() =>
                          openArtifact("markdown", {
                            title: artifact.title,
                            content: artifact.content,
                          })
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {artifact.title || "Tech Spec"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Markdown Doc
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                        >
                          Read
                        </Button>
                      </Card>
                    </div>
                  </div>
                );
              }
            }

            // Render approvals (skip if already rendered as inline approval)
            if (event.type === "approval" && event.approval) {
              // Check if this approval was already rendered as inline approval
              const prevEvent = events[index - 1];
              const isInlineApproval =
                prevEvent?.type === "message" &&
                prevEvent?.message?.role === "assistant";

              if (isInlineApproval) {
                // Skip - already rendered as inline approval
                return null;
              }

              const approval = event.approval;
              const riskColor = {
                high: "red",
                medium: "yellow",
                low: "blue",
              }[approval.risk];

              const riskLabel = {
                high: "High Risk",
                medium: "Medium Risk",
                low: "Low Risk",
              }[approval.risk];

              const riskEmoji = {
                high: "⚠️",
                medium: "⚡",
                low: "ℹ️",
              }[approval.risk];

              return (
                <div key={event.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 border bg-muted">
                    <AvatarFallback>{riskEmoji}</AvatarFallback>
                  </Avatar>
                  <div className="flex max-w-[70%] flex-col gap-2">
                    <div
                      className={`font-semibold text-sm text-${riskColor}-600`}
                    >
                      Approval Required - {riskLabel}
                    </div>
                    <div
                      className={`rounded-lg border bg-${riskColor}-500/5 px-4 py-2 text-sm`}
                    >
                      {approval.reason}
                    </div>

                    {/* Command Approval Component */}
                    <div className="w-full">
                      <CommandApproval
                        approval={approval}
                        runId={approval.run_id}
                        onApprovalResolved={(resolved) => {
                          console.log("Approval resolved:", resolved);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
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
