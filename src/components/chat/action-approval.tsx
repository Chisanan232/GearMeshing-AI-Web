// src/components/chat/action-approval.tsx
"use client";

import React, { useState } from "react";
import {
  Terminal,
  Box,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Edit2,
  Play,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ActionApprovalProps {
  id: string;
  type: "mcp_tool" | "command_line";
  source: string; // MCP Server Name or Terminal
  action: string; // Tool Name or CLI Command
  reason?: string; // Why this action is needed
  params?: Record<string, unknown>; // MCP args
  canEdit?: boolean; // 由 Policy 控制
  isMini?: boolean; // 是否為簡約模式
  onApprove: (
    id: string,
    updatedAction: string,
    updatedParams?: Record<string, unknown>,
  ) => void;
  onReject: (id: string) => void;
}

export function ActionApproval({
  id,
  type,
  source,
  action,
  reason,
  canEdit = true,
  isMini = false,
  onApprove,
  onReject,
}: ActionApprovalProps) {
  const [expanded, setExpanded] = useState(!isMini);
  const [currentAction, setCurrentAction] = useState(action);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );

  if (status === "approved")
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-2 space-y-0.5">
        <div className="flex items-start gap-1.5">
          <ShieldCheck className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-green-600">
              ✅ Executed:{" "}
              {type === "mcp_tool"
                ? `${source} / ${currentAction.split(" ")[0]}`
                : currentAction}
            </div>
            {reason && (
              <div className="text-[10px] text-green-600/80 mt-0.5">{reason}</div>
            )}
          </div>
        </div>
      </div>
    );

  if (status === "rejected")
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-2 space-y-0.5">
        <div className="flex items-start gap-1.5">
          <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-red-600">
              ❌ Rejected:{" "}
              {type === "mcp_tool"
                ? `${source} / ${currentAction.split(" ")[0]}`
                : currentAction}
            </div>
            {reason && (
              <div className="text-[10px] text-red-600/80 mt-0.5">{reason}</div>
            )}
            <div className="text-[10px] text-red-600/70 mt-0.5 italic">
              Skipped. Workflow continues.
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={cn(
        "my-1 rounded-lg border transition-all overflow-hidden max-w-[70%]",
        isMini
          ? "border-primary/20 bg-primary/5"
          : "border-primary/30 bg-card shadow-sm",
      )}
    >
      {/* Header Line - Compact */}
      <div
        className="flex items-center justify-between px-2 py-1.5 bg-muted/40 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-1.5">
          {type === "mcp_tool" ? (
            <Box className="w-3 h-3 text-blue-400" />
          ) : (
            <Terminal className="w-3 h-3 text-green-400" />
          )}
          <span className="text-[11px] font-mono font-medium">
            {source} <span className="text-muted-foreground mx-0.5">/</span>{" "}
            {action.split(" ")[0]}
          </span>
          <Badge
            variant="secondary"
            className="text-[8px] h-3.5 px-0.5 uppercase opacity-70"
          >
            {type.replace("_", " ")}
          </Badge>
        </div>
        {expanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </div>

      {/* Expandable Content - Compact */}
      {expanded && (
        <div className="p-2 space-y-2 bg-background/50">
          <div className="space-y-1">
            <label className="text-[9px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tighter">
              Target Execution
              {canEdit && (
                <Badge className="bg-orange-500/10 text-orange-500 border-none scale-75 origin-left">
                  EDITABLE
                </Badge>
              )}
            </label>

            {canEdit ? (
              <div className="relative group">
                <Input
                  value={currentAction}
                  onChange={(e) => setCurrentAction(e.target.value)}
                  className="h-7 text-[11px] font-mono bg-black/40 border-primary/20 focus:border-primary/50"
                />
                <Edit2 className="absolute right-2 top-1.5 w-2.5 h-2.5 text-muted-foreground opacity-50" />
              </div>
            ) : (
              <div className="p-1.5 rounded bg-black/40 border text-[11px] font-mono text-primary/80">
                $ {action}
              </div>
            )}
          </div>

          {/* Buttons Area - Compact */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <Button
              size="sm"
              className="h-6 text-[10px] bg-green-600 hover:bg-green-700 flex-1"
              onClick={() => {
                setStatus("approved");
                onApprove(id, currentAction);
              }}
            >
              <Play className="w-2.5 h-2.5 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-[10px] text-red-400 hover:bg-red-400/10 flex-1"
              onClick={() => {
                setStatus("rejected");
                onReject(id);
              }}
            >
              <XCircle className="w-2.5 h-2.5 mr-1" /> Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
