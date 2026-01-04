// src/components/layout/folder-item.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Trash2,
  Edit2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSession, ChatFolder } from "@/store/use-ui-store";
import { useUIStore } from "@/store/use-ui-store";
import { SessionItem } from "./session-item";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderItemProps {
  folder: ChatFolder & { sessionCount: number };
  isExpanded: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  folders?: ChatFolder[];
  onSessionRename?: (sessionId: string, newTitle: string) => void;
  onSessionMoveToFolder?: (sessionId: string, folderId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
}

export function FolderItem({
  folder,
  isExpanded,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  folders = [],
  onSessionRename,
  onSessionMoveToFolder,
  onSessionDelete,
}: FolderItemProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
  });

  const { updateFolder, deleteFolder } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== folder.name) {
      updateFolder(folder.id, editName);
    }
    setIsEditing(false);
    setEditName(folder.name);
  };

  const handleDeleteFolder = () => {
    if (
      confirm(
        `Delete folder "${folder.name}"? Sessions will be moved to History.`,
      )
    ) {
      deleteFolder(folder.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group rounded-lg transition-colors",
        isOver && "bg-violet-500/20",
      )}
    >
      {/* Folder Header */}
      <div className="flex items-center gap-1 pl-1 py-0.5 pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditName(folder.name);
                }
              }}
              className="w-full rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:bg-white/20"
            />
          ) : (
            <button
              onClick={onToggle}
              className="flex items-center gap-0.5 rounded px-1 py-0.5 text-left text-xs font-medium text-white/80 hover:bg-white/5 hover:text-white min-w-0 flex-1"
            >
              <FolderOpen className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{folder.name}</span>
              <span className="text-xs text-white/50 flex-shrink-0 ml-0.5">
                ({folder.sessionCount})
              </span>
            </button>
          )}
        </div>

        {/* Folder Actions Menu - Always visible on hover */}
        <div className="ml-auto flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded p-1 hover:bg-white/10">
                <MoreVertical className="h-3 w-3 text-white/70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => setIsEditing(true)}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteFolder}
                className="cursor-pointer text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Folder Contents */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 border-l border-white/10 py-1 pl-8">
              {sessions.length > 0 ? (
                sessions
                  .sort(
                    (a, b) =>
                      new Date(b.updated_at).getTime() -
                      new Date(a.updated_at).getTime(),
                  )
                  .map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={activeSessionId === session.id}
                      onSelect={() => onSelectSession(session.id)}
                      folders={folders}
                      onRename={onSessionRename}
                      onMoveToFolder={onSessionMoveToFolder}
                      onDelete={onSessionDelete}
                    />
                  ))
              ) : (
                <p className="px-3 py-2 text-xs text-white/40">
                  No sessions yet
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
