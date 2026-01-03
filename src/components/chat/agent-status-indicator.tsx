// src/components/chat/agent-status-indicator.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";

interface AgentStatusIndicatorProps {
  thoughtLogs?: string[];
}

export function AgentStatusIndicator({
  thoughtLogs = [],
}: AgentStatusIndicatorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-2 flex gap-3">
      {/* Pulsing Indicator */}
      <div className="flex flex-shrink-0 items-center justify-center">
        <div className="relative h-8 w-8">
          {/* Outer pulsing ring */}
          <div
            className="absolute inset-0 rounded-full bg-violet-500/20 animate-pulse"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          {/* Middle ring */}
          <div className="absolute inset-1 rounded-full border border-violet-500/40" />
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-violet-500/30" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="h-4 w-4 text-violet-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/5 px-3 py-2 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/10"
        >
          <span>🤔 Agent is thinking...</span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          )}
        </button>

        {/* Expandable Thought Logs */}
        {expanded && thoughtLogs.length > 0 && (
          <div className="mt-2 space-y-1 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
            {thoughtLogs.map((log, index) => (
              <div
                key={index}
                className="flex gap-2 text-xs text-violet-300/80"
              >
                <span className="flex-shrink-0 text-violet-400">→</span>
                <span className="flex-1">{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
