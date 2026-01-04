// src/components/layout/session-item.tsx
"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  MessageCircle,
  MoreVertical,
  Edit2,
  Folder,
  Trash2,
} from "lucide-react";
import { ChatSession, ChatFolder } from "@/store/use-ui-store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  folders?: ChatFolder[];
  onRename?: (sessionId: string, newTitle: string) => void;
  onMoveToFolder?: (sessionId: string, folderId: string) => void;
  onDelete?: (sessionId: string) => void;
}

export function SessionItem({
  session,
  isActive,
  onSelect,
  folders = [],
  onRename,
  onMoveToFolder,
  onDelete,
}: SessionItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: session.id,
  });

  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(session.title);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== session.title) {
      onRename?.(session.id, newTitle);
    }
    setIsRenaming(false);
    setNewTitle(session.title);
  };

  const handleDelete = () => {
    if (confirm(`Delete chat "${session.title}"?`)) {
      onDelete?.(session.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "relative w-full rounded-lg transition-colors",
        isDragging && "opacity-50",
      )}
    >
      {isRenaming ? (
        <input
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              setIsRenaming(false);
              setNewTitle(session.title);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:bg-white/20"
        />
      ) : (
        <div className="relative flex items-center gap-0.5 rounded-lg pl-1 py-1 pr-2">
          <button
            onClick={onSelect}
            className={cn(
              "relative flex-1 flex items-center gap-1 text-left text-xs transition-colors rounded-lg px-1 py-0.5 min-w-0",
              isActive
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <MessageCircle className="h-3 w-3 flex-shrink-0" />
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="relative">
                <p className="truncate font-medium text-xs">{session.title}</p>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
              </div>
              {session.preview && (
                <div className="relative">
                  <p className="truncate text-xs text-white/50 line-clamp-1">
                    {session.preview}
                  </p>
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* Left accent border for active state */}
            {isActive && (
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-violet-500" />
            )}
          </button>

          {/* Action Menu */}
          <div className="flex-shrink-0 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded p-1 hover:bg-white/10">
                  <MoreVertical className="h-4 w-4 text-white/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setIsRenaming(true)}
                  className="cursor-pointer"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>

                {folders.length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Folder className="mr-2 h-4 w-4" />
                      Move to folder
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {folders.map((folder) => (
                        <DropdownMenuItem
                          key={folder.id}
                          onClick={() =>
                            onMoveToFolder?.(session.id, folder.id)
                          }
                          className="cursor-pointer"
                        >
                          {folder.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
}
