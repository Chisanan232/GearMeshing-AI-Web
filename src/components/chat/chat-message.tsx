// src/components/chat/chat-message.tsx
"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Approval } from "@/services";
import { ActionApproval } from "./action-approval";
import { useUIStore } from "@/store/use-ui-store";
import { runService } from "@/services";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  avatar?: string;
  avatarFallback?: string;
  timestamp?: string;
  // Inline approvals within the message
  inlineApprovals?: Approval[];
  isMini?: boolean;
}

export function ChatMessage({
  role,
  content,
  avatar,
  avatarFallback,
  timestamp,
  inlineApprovals = [],
  isMini = false,
}: ChatMessageProps) {
  const { updateApprovalStatus } = useUIStore();

  const handleApprove = async (approvalId: string, updatedAction: string) => {
    try {
      // Update local state
      updateApprovalStatus(approvalId, "approved");

      // Find the approval to get run_id
      const approval = inlineApprovals.find((a) => a.id === approvalId);
      if (!approval) return;

      // Submit approval to backend with edited action
      await runService.submitApproval(approval.run_id, approvalId, {
        decision: "approved",
        action: updatedAction,
        note:
          updatedAction !== approval.action
            ? `Modified: ${updatedAction}`
            : undefined,
      });
    } catch (error) {
      console.error("Failed to approve action:", error);
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      // Update local state
      updateApprovalStatus(approvalId, "rejected");

      // Find the approval to get run_id
      const approval = inlineApprovals.find((a) => a.id === approvalId);
      if (!approval) return;

      // Submit rejection to backend
      await runService.submitApproval(approval.run_id, approvalId, {
        decision: "rejected",
        note: "Action rejected by user",
      });
    } catch (error) {
      console.error("Failed to reject action:", error);
    }
  };

  const isSystem = role === "system";
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} ${
        isMini ? "mb-2" : "mb-6"
      }`}
    >
      {/* Avatar - only show for assistant and system messages */}
      {!isUser && (
        <Avatar className={`flex-shrink-0 ${isMini ? "h-6 w-6" : "h-8 w-8"}`}>
          {avatar && <AvatarImage src={avatar} />}
          <AvatarFallback className={isMini ? "text-xs" : ""}>
            {avatarFallback || (isSystem ? "⚠️" : "AI")}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col gap-2 ${
          isUser ? "max-w-[80%]" : "max-w-[85%]"
        } ${isMini ? "flex-1" : ""}`}
      >
        {/* Message Text */}
        {content && (
          <div
            className={`rounded-lg px-4 py-2 text-sm ${
              isUser
                ? "bg-primary text-primary-foreground"
                : isSystem
                  ? "border bg-red-500/5 text-foreground"
                  : "border bg-muted/50 text-foreground"
            } ${isMini ? "text-xs" : ""}`}
          >
            {content}
          </div>
        )}

        {/* Inline Approvals */}
        {inlineApprovals.length > 0 && (
          <div className={`space-y-2 ${isMini ? "space-y-1" : ""}`}>
            {inlineApprovals.map((approval) => (
              <ActionApproval
                key={approval.id}
                id={approval.id}
                type={approval.type || "command_line"}
                source={approval.source || "system"}
                action={approval.action || ""}
                reason={approval.reason}
                params={approval.params}
                canEdit={approval.metadata?.can_edit ?? true}
                isMini={isMini}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <span className="text-[10px] text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Avatar for user messages - on the right */}
      {isUser && (
        <Avatar className={`flex-shrink-0 ${isMini ? "h-6 w-6" : "h-8 w-8"}`}>
          {avatar && <AvatarImage src={avatar} />}
          <AvatarFallback className={isMini ? "text-xs" : ""}>
            {avatarFallback || "ME"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
