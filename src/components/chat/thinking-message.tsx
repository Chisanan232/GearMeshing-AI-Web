// src/components/chat/thinking-message.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";

interface ThinkingMessageProps {
  id: string;
  content: string; // Streaming thinking text
  isStreaming?: boolean; // Whether still receiving text
  onComplete?: (id: string) => void; // Called when thinking completes
}

export function ThinkingMessage({
  id,
  content,
  isStreaming = false,
  onComplete,
}: ThinkingMessageProps) {
  const [expanded, setExpanded] = useState(true);
  const [displayedContent, setDisplayedContent] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Simulate streaming text display (character by character)
  useEffect(() => {
    if (!content) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        if (!isStreaming && onComplete) {
          onComplete(id);
        }
      }
    }, 20); // 20ms per character for smooth streaming effect

    return () => clearInterval(interval);
  }, [content, isStreaming, id, onComplete]);

  // Blinking cursor effect
  useEffect(() => {
    if (!isStreaming) return;

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isStreaming]);

  return (
    <div className="my-3 flex gap-3">
      {/* Pulsing Indicator */}
      <div className="flex flex-shrink-0 items-center justify-center">
        <div className="relative h-8 w-8">
          {/* Outer pulsing ring */}
          <div
            className="absolute inset-0 rounded-full bg-violet-500/20"
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
        {/* Header - Toggle Button */}
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

        {/* Expandable Thinking Content */}
        {expanded && (
          <div className="mt-2 rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
            {/* Thinking text with streaming effect */}
            <div className="space-y-2">
              <div className="text-sm text-violet-300/90 leading-relaxed whitespace-pre-wrap break-words">
                {displayedContent}
                {isStreaming && (
                  <span
                    className={`inline-block w-1.5 h-4 ml-0.5 bg-violet-400 rounded-sm transition-opacity ${
                      cursorVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>

              {/* Streaming indicator */}
              {isStreaming && (
                <div className="flex items-center gap-2 text-xs text-violet-400">
                  <div className="flex gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span>Streaming...</span>
                </div>
              )}

              {/* Completion indicator */}
              {!isStreaming && displayedContent && (
                <div className="text-xs text-violet-400/70">
                  ✓ Thinking complete
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
