// src/components/layout/session-item.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { MessageCircle } from "lucide-react";
import { ChatSession } from "@/store/use-ui-store";
import { cn } from "@/lib/utils";

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
}

export function SessionItem({
  session,
  isActive,
  onSelect,
}: SessionItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: session.id,
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={cn(
        "group relative w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{session.title}</p>
          {session.preview && (
            <p className="truncate text-xs text-white/50">{session.preview}</p>
          )}
        </div>
      </div>

      {/* Left accent border for active state */}
      {isActive && (
        <div className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-violet-500" />
      )}
    </button>
  );
}
